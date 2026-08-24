#!/usr/bin/env node
/**
 * Release-build mods, then upload to Steam Workshop with SteamCMD.
 * Uses SteamCMD on PATH, or downloads the official Valve installer into .tmp/steamcmd/.
 * Usage: npm run publish
 *        npm run publish -- --mod selection-capture
 *        npm run publish -- --mod selection-capture --yes
 */
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadMods, parseModFilter, publishStagingDir } from "../lib/mods.js";
import { steamLibraryRoots } from "../lib/paths.js";
import { isPublishTty, tuiConfirm, tuiSelect } from "./publish-tui.js";
import {
  copyWorkshopInstallFiles,
  parsePublishedFileIdFromVdf,
  readChangelogChangeNote,
  readWorkshopManifest,
  WORKSHOP_NEW_ITEM_ID,
  workshopDescriptionText,
  workshopPreviewPath,
  workshopPublishReadiness,
  writeWorkshopManifest,
} from "../lib/workshop-files.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const SANDUSTRY_APP_ID = "2764460";
const STEAMCMD_DOCS = "https://developer.valvesoftware.com/wiki/SteamCMD";
const STEAMCMD_LOCAL_DIR = join(ROOT, ".tmp", "steamcmd");
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
    STEAMCMD_LOCAL_DIR,
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
 * Official Valve archive. The npm `steamcmd` package (2017) is not used: it
 * pulls `request` / `unzip`, and its API is game download, not Workshop upload.
 * @returns {{ url: string, archiveName: string }}
 */
function officialSteamCmdArchive() {
  if (IS_WIN) {
    return {
      url: "https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip",
      archiveName: "steamcmd.zip",
    };
  }
  if (process.platform === "darwin") {
    return {
      url: "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz",
      archiveName: "steamcmd_osx.tar.gz",
    };
  }
  if (process.platform === "linux") {
    return {
      url: "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz",
      archiveName: "steamcmd_linux.tar.gz",
    };
  }
  fail(`No official SteamCMD archive for ${process.platform}. See ${STEAMCMD_DOCS}`);
  throw new Error("unreachable");
}

/**
 * @param {string} dir
 * @param {string} archive
 */
function extractSteamCmdArchive(dir, archive) {
  const args = archive.endsWith(".zip")
    ? ["-xf", archive, "-C", dir]
    : ["-xzf", archive, "-C", dir];
  const unpacked = spawnSync("tar", args, { stdio: "inherit" });
  if (unpacked.status !== 0) {
    fail(`Failed to unpack SteamCMD archive with tar (exit ${unpacked.status ?? "?"}).`);
  }
}

/**
 * SteamCMD exit 7 means it self-updated. That is success for a first run.
 * @param {string} bin
 */
function bootstrapSteamCmd(bin) {
  console.log("Updating SteamCMD (first run)…");
  let result;
  try {
    result = spawnSync(bin, ["+quit"], {
      cwd: dirname(bin),
      stdio: "inherit",
      timeout: 180_000,
    });
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
  if (result.status !== 0 && result.status !== 7) {
    fail(`SteamCMD bootstrap failed (exit ${result.status ?? "?"}). See ${STEAMCMD_DOCS}`);
  }
}

/**
 * @returns {Promise<string>}
 */
async function ensureSteamCmd() {
  const existing = findSteamCmd();
  if (existing) {
    if (!IS_WIN && existing.startsWith(STEAMCMD_LOCAL_DIR) && existing.endsWith(".sh")) {
      chmodSync(existing, 0o755);
    }
    return existing;
  }

  console.log(`SteamCMD not on PATH. Downloading into ${STEAMCMD_LOCAL_DIR}/ …`);
  mkdirSync(STEAMCMD_LOCAL_DIR, { recursive: true });
  const { url, archiveName } = officialSteamCmdArchive();
  const archive = join(STEAMCMD_LOCAL_DIR, archiveName);
  const res = await fetch(url);
  if (!res.ok) fail(`SteamCMD download failed: ${res.status} ${res.statusText} (${url})`);
  writeFileSync(archive, Buffer.from(await res.arrayBuffer()));
  extractSteamCmdArchive(STEAMCMD_LOCAL_DIR, archive);
  unlinkSync(archive);

  const bin = findSteamCmd();
  if (!bin) {
    fail(`SteamCMD download finished, but the binary is missing. See ${STEAMCMD_DOCS}`);
  }
  if (!IS_WIN && bin.endsWith(".sh")) chmodSync(bin, 0o755);
  bootstrapSteamCmd(bin);
  return bin;
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
  fail(`src/${mod.folder}/workshop/workshop.md is missing (or set modinfo.description).`);
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

/**
 * @param {import("../build/mods.js").LoadedMod} mod
 * @param {string} vdfFile
 */
function saveNewWorkshopId(mod, vdfFile) {
  const newId = parsePublishedFileIdFromVdf(readFileSync(vdfFile, "utf8"));
  if (!newId) {
    fail(
      [
        "Workshop upload succeeded, but SteamCMD did not write a publishedfileid to the upload VDF.",
        "Check the SteamCMD output above, then add src/" +
          `${mod.folder}/workshop/workshop.json manually.`,
      ].join("\n"),
    );
  }
  writeWorkshopManifest(mod.dir, newId);
  copyWorkshopInstallFiles(mod.dir, mod.outDir);
  console.log(`Saved src/${mod.folder}/workshop/workshop.json with publishedFileId ${newId}.`);
}

async function publishMod(steamCmd, account, mod) {
  let manifest;
  try {
    manifest = readWorkshopManifest(mod.dir);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }

  const existingId = manifest?.publishedFileId ?? null;
  const publishedFileId = existingId ?? WORKSHOP_NEW_ITEM_ID;
  const isNewItem = publishedFileId === WORKSHOP_NEW_ITEM_ID;

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

  console.log(
    isNewItem
      ? `Workshop upload: src/${mod.folder}/ -> new item (SteamCMD assigns id)`
      : `Workshop upload: src/${mod.folder}/ -> ${publishedFileId}`,
  );
  console.log(`Preview: ${previewFile}`);
  console.log(`Content: ${mod.outDir}`);
  console.log(`Change notes:\n${changeNote}`);

  let result = await runWorkshopUpload(steamCmd, account, vdfFile);
  if (workshopUploadSucceeded(result.out)) {
    if (isNewItem) saveNewWorkshopId(mod, vdfFile);
    return;
  }

  if (steamCmdNeedsCachedLogin(result.out) && isPublishTty()) {
    const loginCode = await runSteamCmdInteractiveLogin(steamCmd, account);
    if (loginCode !== 0) {
      fail(`SteamCMD login failed for ${account} (exit ${loginCode ?? "?"}).`);
    }
    console.log("Retrying Workshop upload…");
    result = await runWorkshopUpload(steamCmd, account, vdfFile);
    if (workshopUploadSucceeded(result.out)) {
      if (isNewItem) saveNewWorkshopId(mod, vdfFile);
      return;
    }
  }

  failWorkshopUpload(mod.folder, account, steamCmd, result.out);
}

function workshopState(mod) {
  return workshopPublishReadiness(mod.dir, mod.manifest);
}

async function pickMod(allMods) {
  const filter = parseModFilter(buildArgv);
  if (filter) {
    const selected = allMods.find((mod) => mod.folder === filter);
    if (!selected) fail(`Unknown --mod ${JSON.stringify(filter)}.`);
    const state = workshopState(selected);
    if (state.error) fail(state.error);
    if (!state.ready) fail(`src/${selected.folder}/ is not ready for Workshop publish.`);
    return selected;
  }

  if (!isPublishTty()) {
    fail("Pass --mod <folder> when stdin is not a TTY.");
  }

  const items = allMods.map((mod) => {
    const state = workshopState(mod);
    const ready = state.ready && !state.error;
    const firstPublish = ready && !state.publishedFileId;
    const hint = !ready
      ? (state.error ?? "missing listing assets")
      : firstPublish
        ? `${mod.manifest.name} · first publish`
        : String(mod.manifest.name);
    return {
      label: mod.folder,
      hint,
      hintTone: firstPublish ? /** @type {const} */ ("green") : undefined,
      disabled: !ready,
      value: mod,
    };
  });

  if (!items.some((item) => !item.disabled)) {
    fail(
      "No mod is ready to publish. Add workshop/preview.png (or preview.gif) and workshop/workshop.md (or modinfo.description).",
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

async function confirmUpload(mod, account, steamCmd, previewFile, publishedFileId, isNewItem) {
  if (yesFlag) return true;
  if (!isPublishTty()) {
    fail("Pass --yes to skip confirmation when stdin is not a TTY.");
  }
  const changeNote = workshopChangeNote(mod);
  const green = "\x1b[32m";
  const reset = "\x1b[0m";
  const itemLabel = isNewItem
    ? `${green}first publish · SteamCMD creates a new item${reset}`
    : publishedFileId;
  try {
    return await tuiConfirm({
      title: isNewItem ? "Create Steam Workshop item?" : "Upload to Steam Workshop?",
      fields: [
        ["Folder", `src/${mod.folder}/`],
        ["Title", String(mod.manifest.name).trim()],
        ["Version", String(mod.manifest.version ?? "")],
        ["Item", itemLabel],
        ["Preview", basename(previewFile)],
        ["Steam", account],
        ["SteamCMD", steamCmd],
        ["Staging", `build/${mod.gameId}/`],
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

const steamCmd = await ensureSteamCmd();

const account = steamAccountName();
const allMods = (await loadMods([], { includeDebugKit: false })).filter(
  (mod) => mod.root === "src",
);
const selected = await pickMod(allMods);

const publishState = workshopState(selected);
if (publishState.error) fail(publishState.error);
if (!publishState.ready) fail(`src/${selected.folder}/ is not ready for Workshop publish.`);

const publishedFileId = publishState.publishedFileId ?? WORKSHOP_NEW_ITEM_ID;
const isNewItem = publishedFileId === WORKSHOP_NEW_ITEM_ID;

const previewFile = previewPath(selected);
const confirmed = await confirmUpload(
  selected,
  account,
  steamCmd,
  previewFile,
  publishedFileId,
  isNewItem,
);
if (!confirmed) {
  console.log("Cancelled.");
  process.exit(0);
}

console.log("Release build…");
const build = spawnSync("npm", ["run", "build", "--", "--mod", selected.folder], {
  stdio: "inherit",
  cwd: ROOT,
  shell: true,
});
if (build.status !== 0) process.exit(build.status ?? 1);

selected.outDir = publishStagingDir(selected.gameId);
if (!existsSync(join(selected.outDir, "main.js"))) {
  fail(`Publish staging missing main.js: ${selected.outDir}`);
}

await publishMod(steamCmd, account, selected);
console.log("Workshop upload finished.");
