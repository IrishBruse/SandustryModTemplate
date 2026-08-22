#!/usr/bin/env node
/**
 * Release-build mods, then upload to Steam Workshop with SteamCMD.
 * Requires SteamCMD: https://developer.valvesoftware.com/wiki/SteamCMD
 * Usage: npm run publish
 *        npm run publish -- --mod selection-capture
 *        npm run publish -- --mod selection-capture --yes
 */
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadMods, parseModFilter, publishStagingDir } from "../lib/mods.js";
import { steamLibraryRoots } from "../lib/paths.js";
import { isPublishTty, tuiConfirm, tuiSelect } from "./publish-tui.js";
import {
  readChangelogChangeNote,
  readWorkshopManifest,
  workshopDescriptionText,
  workshopPreviewPath,
} from "../lib/workshop-files.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const SANDUSTRY_APP_ID = "2764460";
const STEAMCMD_DOCS = "https://developer.valvesoftware.com/wiki/SteamCMD";
const IS_WIN = process.platform === "win32";

const argv = process.argv.slice(2);
const yesFlag = argv.includes("--yes");
const buildArgv = argv.filter((arg) => arg !== "--yes");

function fail(message) {
  console.error(message);
  process.exit(1);
}

/**
 * @param {string} value
 * @returns {string}
 */
function vdfEscape(value) {
  return String(value).replaceAll("\r\n", "\n").replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

/**
 * @param {string} filePath
 * @returns {string}
 */
function vdfPath(filePath) {
  return IS_WIN ? filePath.replaceAll("/", "\\") : filePath;
}

/**
 * @param {object} item
 * @param {string} item.appId
 * @param {string} item.publishedFileId
 * @param {string} item.contentFolder
 * @param {string} item.previewFile
 * @param {string} item.title
 * @param {string} item.description
 * @param {string} item.changeNote
 * @returns {string}
 */
function workshopItemVdf(item) {
  return [
    `"workshopitem"`,
    `{`,
    `\t"appid"\t\t"${item.appId}"`,
    `\t"publishedfileid"\t\t"${item.publishedFileId}"`,
    `\t"contentfolder"\t\t"${vdfEscape(vdfPath(item.contentFolder))}"`,
    `\t"previewfile"\t\t"${vdfEscape(vdfPath(item.previewFile))}"`,
    `\t"title"\t\t"${vdfEscape(item.title)}"`,
    `\t"description"\t\t"${vdfEscape(item.description)}"`,
    `\t"changenote"\t\t"${vdfEscape(item.changeNote)}"`,
    `}`,
    ``,
  ].join("\n");
}

/**
 * @param {string} name
 * @returns {string | null}
 */
function commandOnPath(name) {
  try {
    const out = execFileSync(IS_WIN ? "where" : "which", [name], {
      encoding: "utf8",
    }).trim();
    return out.split(/\r?\n/).find((line) => line && existsSync(line)) ?? null;
  } catch {
    return null;
  }
}

/** @returns {string | null} */
function findSteamCmd() {
  const fromPath = commandOnPath(IS_WIN ? "steamcmd.exe" : "steamcmd");
  if (fromPath) return fromPath;

  const names = IS_WIN
    ? ["steamcmd.exe", join("steamcmd", "steamcmd.exe")]
    : ["steamcmd.sh", join("steamcmd", "steamcmd.sh"), join("steamcmd", "linux64", "steamcmd")];

  const roots = [
    ...steamLibraryRoots(),
    join(homedir(), "steamcmd"),
    join(ROOT, ".tmp", "steamcmd"),
    "/usr/games",
  ];
  for (const root of roots) {
    for (const name of names) {
      const candidate = join(root, name);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

/**
 * @param {string} text
 * @returns {string | null}
 */
function mostRecentSteamAccountName(text) {
  let lastAccount = null;
  let firstAccount = null;
  let mostRecent = null;
  let timestampAccount = null;
  let bestTimestamp = -1;

  for (const line of text.split(/\r?\n/)) {
    const acc = line.match(/"AccountName"\s+"([^"]+)"/);
    if (acc) {
      lastAccount = acc[1];
      firstAccount ??= lastAccount;
    }
    const recent = line.match(/"MostRecent"\s+"(\d+)"/);
    if (recent?.[1] === "1" && lastAccount) mostRecent = lastAccount;
    const ts = line.match(/"Timestamp"\s+"(\d+)"/);
    if (ts && lastAccount) {
      const stamp = Number(ts[1]);
      if (Number.isFinite(stamp) && stamp >= bestTimestamp) {
        bestTimestamp = stamp;
        timestampAccount = lastAccount;
      }
    }
  }

  return mostRecent ?? timestampAccount ?? firstAccount;
}

/** @returns {string} */
function steamAccountName() {
  for (const root of steamLibraryRoots()) {
    const loginUsers = join(root, "config", "loginusers.vdf");
    if (!existsSync(loginUsers)) continue;
    try {
      const name = mostRecentSteamAccountName(readFileSync(loginUsers, "utf8"));
      if (name) return name;
    } catch {
      // Try the next Steam root.
    }
  }
  fail(
    "No Steam account in loginusers.vdf. Log into the Steam client once, then run npm run publish again.",
  );
}

/**
 * @param {import("../build/mods.js").LoadedMod} mod
 * @returns {string}
 */
function previewPath(mod) {
  const filePath = workshopPreviewPath(mod.dir);
  if (filePath) return filePath;
  fail(`src/${mod.folder}/workshop/ needs preview.gif or preview.png.`);
}

/**
 * @param {import("../build/mods.js").LoadedMod} mod
 * @returns {string}
 */
function workshopDescription(mod) {
  const fromFile = workshopDescriptionText(mod.dir);
  if (fromFile) return fromFile;
  const fromManifest = mod.manifest.description;
  if (typeof fromManifest === "string" && fromManifest.trim()) return fromManifest.trim();
  fail(`src/${mod.folder}/workshop/workshop.txt is missing (or set modinfo.description).`);
}

/**
 * Steam changenote: CHANGELOG.md for this version, or the version string.
 * @param {import("../build/mods.js").LoadedMod} mod
 * @param {{ warn?: boolean }} [options]
 * @returns {string}
 */
function workshopChangeNote(mod, { warn = true } = {}) {
  const version = String(mod.manifest.version ?? "").trim();
  const fromLog = readChangelogChangeNote(mod.dir, version);
  if (!fromLog) return version || "Update";
  if (warn && fromLog.source === "unreleased") {
    console.warn(
      `CHANGELOG.md has no ## ${version} section. Using ## Unreleased for Steam change notes. Rename that heading to ## ${version} for this release.`,
    );
  }
  return fromLog.text;
}

/**
 * @param {string} bin
 * @param {string[]} args
 * @returns {Promise<{ code: number | null; out: string }>}
 */
function runSteamCmd(bin, args) {
  return new Promise((resolve, reject) => {
    // Do not inherit the TTY. SteamCMD otherwise stays on the Steam> prompt
    // after +workshop_build_item and never runs +quit.
    const child = spawn(bin, args, { stdio: ["pipe", "pipe", "pipe"] });
    try {
      child.stdin.end();
    } catch {
      /* ignore */
    }
    let out = "";
    let settled = false;
    /** @type {ReturnType<typeof setTimeout> | null} */
    let stopTimer = null;

    const finish = (code) => {
      if (settled) return;
      settled = true;
      if (stopTimer) clearTimeout(stopTimer);
      try {
        child.stdin.end();
      } catch {
        /* already closed */
      }
      resolve({ code, out });
    };

    const stopSteamCmd = (reason) => {
      if (settled || child.exitCode != null) return;
      console.warn(`${reason} Stopping SteamCMD.`);
      try {
        child.kill("SIGTERM");
      } catch {
        /* already gone */
      }
      setTimeout(() => {
        if (settled || child.exitCode != null) return;
        try {
          child.kill("SIGKILL");
        } catch {
          /* already gone */
        }
      }, 2000);
    };

    const requestQuit = () => {
      if (settled || stopTimer) return;
      try {
        child.stdin.write("quit\n");
        child.stdin.end();
      } catch {
        /* stdin closed */
      }
      stopTimer = setTimeout(() => {
        stopSteamCmd("SteamCMD did not exit after the upload.");
      }, 8000);
    };

    child.stdin.on("error", () => {
      /* EPIPE when SteamCMD already left */
    });

    child.stdout.on("data", (chunk) => {
      const text = String(chunk);
      process.stdout.write(chunk);
      out += text;
      if (workshopUploadFinished(out) || /ERROR!/i.test(out) || /Steam>/.test(out)) {
        requestQuit();
      }
    });
    child.stderr.on("data", (chunk) => {
      const text = String(chunk);
      process.stderr.write(chunk);
      out += text;
      if (workshopUploadFinished(out) || /ERROR!/i.test(out) || /Steam>/.test(out)) {
        requestQuit();
      }
    });
    child.on("error", reject);
    child.on("close", (code) => finish(code));
  });
}

/** True when workshop_build_item finished (not the earlier login "Success."). */
function workshopUploadFinished(out) {
  return /workshop/i.test(out) && /success\./i.test(out);
}

function workshopUploadSucceeded(out) {
  return workshopUploadFinished(out) && !/ERROR!/i.test(out);
}

/** SteamCMD cache is separate from the Steam client login. */
function steamCmdNeedsCachedLogin(out) {
  return (
    /No cached credentials/i.test(out) ||
    /Cached credentials not found/i.test(out) ||
    /@NoPromptForPassword is set/i.test(out)
  );
}

/**
 * Interactive login so SteamCMD can cache credentials for later non-interactive uploads.
 * @param {string} bin
 * @param {string} account
 * @returns {Promise<number | null>}
 */
function runSteamCmdInteractiveLogin(bin, account) {
  return new Promise((resolve, reject) => {
    console.log("");
    console.log(`SteamCMD has no cached login for ${account}.`);
    console.log("Enter your Steam password (and Steam Guard code if asked).");
    console.log("");
    const child = spawn(bin, ["+login", account, "+quit"], { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => resolve(code));
  });
}

/**
 * @param {string} steamCmd
 * @param {string} account
 * @param {string} vdfFile
 * @returns {Promise<{ code: number | null; out: string }>}
 */
async function runWorkshopUpload(steamCmd, account, vdfFile) {
  return runSteamCmd(steamCmd, [
    "+@ShutdownOnFailedCommand",
    "1",
    "+@NoPromptForPassword",
    "1",
    "+login",
    account,
    "+workshop_build_item",
    vdfFile,
    "+quit",
  ]);
}

/**
 * @param {string} folder
 * @param {string} account
 * @param {string} steamCmd
 * @param {string} out
 */
function failWorkshopUpload(folder, account, steamCmd, out) {
  if (steamCmdNeedsCachedLogin(out)) {
    fail(
      [
        `SteamCMD has no cached credentials for ${account}.`,
        `Log in once, then run npm run publish again:`,
        `  ${steamCmd} +login ${account}`,
        `Use the Workshop item owner account. Steam client login alone is not enough.`,
      ].join("\n"),
    );
  }
  fail(
    `SteamCMD did not update ${folder}. Stay logged into Steam as the item owner. Close Steam if SteamCMD reports a lock.`,
  );
}

async function publishMod(steamCmd, account, mod) {
  let publishedFileId;
  try {
    publishedFileId = readWorkshopManifest(mod.dir)?.publishedFileId;
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
  if (!publishedFileId) {
    fail(`src/${mod.folder}/workshop/workshop.json needs publishedFileId.`);
  }

  const previewFile = previewPath(mod);
  const tmpDir = join(ROOT, ".tmp");
  mkdirSync(tmpDir, { recursive: true });
  const vdfFile = join(tmpDir, `workshop-${mod.folder}.vdf`);
  const changeNote = workshopChangeNote(mod, { warn: yesFlag });
  writeFileSync(
    vdfFile,
    workshopItemVdf({
      appId: SANDUSTRY_APP_ID,
      publishedFileId,
      contentFolder: mod.outDir,
      previewFile,
      title: String(mod.manifest.name).trim(),
      description: workshopDescription(mod),
      changeNote,
    }),
  );

  console.log(`Workshop upload: src/${mod.folder}/ -> ${publishedFileId}`);
  console.log(`Preview: ${previewFile}`);
  console.log(`Content: ${mod.outDir}`);
  console.log(`Change notes:\n${changeNote}`);

  let result = await runWorkshopUpload(steamCmd, account, vdfFile);
  if (workshopUploadSucceeded(result.out)) return;

  if (steamCmdNeedsCachedLogin(result.out) && isPublishTty()) {
    const loginCode = await runSteamCmdInteractiveLogin(steamCmd, account);
    if (loginCode !== 0) {
      fail(`SteamCMD login failed for ${account} (exit ${loginCode ?? "?"}).`);
    }
    console.log("Retrying Workshop upload…");
    result = await runWorkshopUpload(steamCmd, account, vdfFile);
    if (workshopUploadSucceeded(result.out)) return;
  }

  failWorkshopUpload(mod.folder, account, steamCmd, result.out);
}

function workshopState(mod) {
  try {
    return { manifest: readWorkshopManifest(mod.dir), error: null };
  } catch (error) {
    return { manifest: null, error: error instanceof Error ? error.message : String(error) };
  }
}

async function pickMod(allMods) {
  const filter = parseModFilter(buildArgv);
  if (filter) {
    const selected = allMods.find((mod) => mod.folder === filter);
    if (!selected) fail(`Unknown --mod ${JSON.stringify(filter)}.`);
    const state = workshopState(selected);
    if (state.error) fail(state.error);
    if (!state.manifest) {
      fail(`src/${selected.folder}/workshop/workshop.json is missing.`);
    }
    return selected;
  }

  if (!isPublishTty()) {
    fail("Pass --mod <folder> when stdin is not a TTY.");
  }

  const items = allMods.map((mod) => {
    const state = workshopState(mod);
    const ready = Boolean(state.manifest);
    return {
      label: mod.folder,
      hint: ready ? String(mod.manifest.name) : (state.error ?? "no workshop.json"),
      disabled: !ready,
      value: mod,
    };
  });

  if (!items.some((item) => !item.disabled)) {
    fail(
      "No mod has workshop/workshop.json. Add publishedFileId after the first in-game Workshop create.",
    );
  }

  try {
    return await tuiSelect({
      title: "Publish which mod?",
      items,
    });
  } catch (error) {
    if (error && typeof error === "object" && "cancelled" in error && error.cancelled) {
      console.log("Cancelled.");
      process.exit("exitCode" in error && typeof error.exitCode === "number" ? error.exitCode : 0);
    }
    throw error;
  }
}

async function confirmUpload(mod, account, steamCmd, previewFile, publishedFileId) {
  if (yesFlag) return true;
  if (!isPublishTty()) {
    fail("Pass --yes to skip confirmation when stdin is not a TTY.");
  }
  const changeNote = workshopChangeNote(mod);
  try {
    return await tuiConfirm({
      title: "Upload to Steam Workshop?",
      fields: [
        ["Folder", `src/${mod.folder}/`],
        ["Title", String(mod.manifest.name).trim()],
        ["Version", String(mod.manifest.version ?? "")],
        ["Item", publishedFileId],
        ["Preview", basename(previewFile)],
        ["Steam", account],
        ["SteamCMD", steamCmd],
        ["Staging", `build/${mod.folder}/`],
      ],
      preview: {
        label: "Change notes (Steam)",
        body: changeNote,
      },
    });
  } catch (error) {
    if (error && typeof error === "object" && "cancelled" in error && error.cancelled) {
      console.log("Cancelled.");
      process.exit("exitCode" in error && typeof error.exitCode === "number" ? error.exitCode : 0);
    }
    throw error;
  }
}

const blocked = argv.find((arg) => arg === "--watch" || arg === "--debug" || arg === "--game");
if (blocked) {
  fail("npm run publish is a release upload. Do not pass --watch, --debug, or --game.");
}

const steamCmd = findSteamCmd();
if (!steamCmd) {
  fail(
    `steamcmd not found. npm run publish requires SteamCMD. Install it from ${STEAMCMD_DOCS} (PATH or .tmp/steamcmd/).`,
  );
}

const account = steamAccountName();
const allMods = await loadMods([], { includeDebugKit: false });
const selected = await pickMod(allMods);

let publishedFileId;
try {
  publishedFileId = readWorkshopManifest(selected.dir)?.publishedFileId;
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
if (!publishedFileId) {
  fail(`src/${selected.folder}/workshop/workshop.json needs publishedFileId.`);
}

const previewFile = previewPath(selected);
const confirmed = await confirmUpload(selected, account, steamCmd, previewFile, publishedFileId);
if (!confirmed) {
  console.log("Cancelled.");
  process.exit(0);
}

console.log("Release build to build/…");
const build = spawnSync("npm", ["run", "build:release", "--", "--mod", selected.folder], {
  stdio: "inherit",
  cwd: ROOT,
  shell: true,
});
if (build.status !== 0) process.exit(build.status ?? 1);

selected.outDir = publishStagingDir(selected.folder);
if (!existsSync(join(selected.outDir, "main.js"))) {
  fail(`Publish staging missing main.js: ${selected.outDir}`);
}

await publishMod(steamCmd, account, selected);
console.log("Workshop upload finished.");
