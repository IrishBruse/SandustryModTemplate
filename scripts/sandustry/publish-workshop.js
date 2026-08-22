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
import { loadMods, parseModFilter } from "../build/mods.js";
import { steamLibraryRoots } from "./paths.js";
import { isPublishTty, tuiConfirm, tuiSelect } from "./publish-tui.js";
import {
  copyWorkshopScreenshots,
  readWorkshopManifest,
  workshopDescriptionText,
  workshopPreviewPath,
  workshopScreenshotPaths,
} from "./workshop-files.js";

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
  return String(value)
    .replaceAll("\r\n", "\n")
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"');
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
 * @param {string} bin
 * @param {string[]} args
 * @returns {Promise<{ code: number | null; out: string }>}
 */
function runSteamCmd(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["inherit", "pipe", "pipe"] });
    let out = "";
    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
      out += chunk;
    });
    child.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
      out += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, out }));
  });
}

function workshopUploadSucceeded(out) {
  return /success/i.test(out) && !/ERROR!/i.test(out);
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
  const screenshots = copyWorkshopScreenshots(mod.dir, mod.outDir);
  const tmpDir = join(ROOT, ".tmp");
  mkdirSync(tmpDir, { recursive: true });
  const vdfFile = join(tmpDir, `workshop-${mod.folder}.vdf`);
  writeFileSync(
    vdfFile,
    workshopItemVdf({
      appId: SANDUSTRY_APP_ID,
      publishedFileId,
      contentFolder: mod.outDir,
      previewFile,
      title: String(mod.manifest.name).trim(),
      description: workshopDescription(mod),
      changeNote: String(mod.manifest.version ?? ""),
    }),
  );

  console.log(`Workshop upload: src/${mod.folder}/ -> ${publishedFileId}`);
  console.log(`Preview: ${previewFile}`);
  if (screenshots.length > 0) {
    console.log(
      `Screenshots: ${screenshots.map((file) => basename(file)).join(", ")}`,
    );
  }
  console.log(`Content: ${mod.outDir}`);

  const args = [
    "+@ShutdownOnFailedCommand",
    "1",
    "+login",
    account,
    "+workshop_build_item",
    vdfFile,
    "+quit",
  ];
  const result = await runSteamCmd(steamCmd, args);
  if (!workshopUploadSucceeded(result.out)) {
    fail(
      `SteamCMD did not update ${mod.folder}. Stay logged into Steam as the item owner. Close Steam if SteamCMD reports a lock.`,
    );
  }
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

async function confirmUpload(mod, account, steamCmd, previewFile, publishedFileId, screenshots) {
  if (yesFlag) return true;
  if (!isPublishTty()) {
    fail("Pass --yes to skip confirmation when stdin is not a TTY.");
  }
  const shotLabel =
    screenshots.length === 0
      ? "(none)"
      : screenshots.map((file) => basename(file)).join(", ");
  try {
    return await tuiConfirm({
      title: "Upload to Steam Workshop?",
      fields: [
        ["Folder", `src/${mod.folder}/`],
        ["Title", String(mod.manifest.name).trim()],
        ["Version", String(mod.manifest.version ?? "")],
        ["Item", publishedFileId],
        ["Preview", basename(previewFile)],
        ["Screenshots", shotLabel],
        ["Steam", account],
        ["SteamCMD", steamCmd],
      ],
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
const allMods = await loadMods([]);
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
const screenshots = workshopScreenshotPaths(selected.dir);
const confirmed = await confirmUpload(
  selected,
  account,
  steamCmd,
  previewFile,
  publishedFileId,
  screenshots,
);
if (!confirmed) {
  console.log("Cancelled.");
  process.exit(0);
}

console.log("Release build…");
const build = spawnSync(
  process.execPath,
  [join(ROOT, "scripts/build/esbuild.config.mjs"), "--mod", selected.folder],
  { stdio: "inherit", cwd: ROOT },
);
if (build.status !== 0) process.exit(build.status ?? 1);

await publishMod(steamCmd, account, selected);
console.log("Workshop upload finished.");
