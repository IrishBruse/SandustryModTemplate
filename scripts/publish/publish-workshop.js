#!/usr/bin/env node
/**
 * Release-build mods, then upload to Steam Workshop with SteamCMD.
 * Uses a dedicated SteamCMD cache (not the desktop Steam tree).
 * Usage: npm run publish
 *        npm run publish -- --mod <folder>
 *        npm run publish -- --mod <folder> --yes
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEBUG_MOD_FOLDER, loadMods, parseModFilter, publishStagingDir } from "../lib/mods.js";
import { steamLibraryRoots } from "../lib/paths.js";
import {
  ensureDedicatedSteamCmd,
  probeSteamCmdLogin,
  runSteamCmdInteractiveLogin,
  runWorkshopUpload,
  steamCmdCacheDir,
  steamCmdNeedsCachedLogin,
  steamCmdPublishLogPath,
  workshopUploadSucceeded,
} from "../lib/steamcmd.js";
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
 * @param {string} folder
 * @param {string} account
 * @param {string} steamCmd
 * @param {string} out
 * @param {string} logPath
 */
function failWorkshopUpload(folder, account, steamCmd, out, logPath) {
  if (steamCmdNeedsCachedLogin(out)) {
    fail(
      [
        `SteamCMD has no cached credentials for ${account}.`,
        `Log in once, then run npm run publish again:`,
        `  ${steamCmd} +login ${account}`,
        `Credentials are stored under ${steamCmdCacheDir()} (not the Steam client).`,
        `Full SteamCMD log: ${logPath}`,
      ].join("\n"),
    );
  }
  fail(
    [
      `SteamCMD did not update ${folder}.`,
      `Stay logged into Steam as the item owner. Close Steam if SteamCMD reports a lock.`,
      `Full SteamCMD log: ${logPath}`,
    ].join("\n"),
  );
}

/**
 * @param {import("../build/mods.js").LoadedMod} mod
 * @param {string} vdfFile
 * @returns {string | null}
 */
function saveNewWorkshopId(mod, vdfFile) {
  const newId = parsePublishedFileIdFromVdf(readFileSync(vdfFile, "utf8"));
  if (!newId) {
    fail(
      [
        "Workshop upload succeeded, but SteamCMD did not write a publishedfileid to the upload VDF.",
        `Check ${steamCmdPublishLogPath(ROOT)}, then add src/${mod.folder}/workshop/workshop.json manually.`,
      ].join("\n"),
    );
  }
  writeWorkshopManifest(mod.dir, newId);
  copyWorkshopInstallFiles(mod.dir, mod.outDir);
  console.log(`Saved src/${mod.folder}/workshop/workshop.json with publishedFileId ${newId}.`);
  return newId;
}

/**
 * @param {string} steamCmd
 * @param {string} account
 */
async function ensureSteamCmdLogin(steamCmd, account) {
  const logPath = steamCmdPublishLogPath(ROOT);
  console.log(`Steam login (${account})…`);
  const probe = await probeSteamCmdLogin(steamCmd, account, { logPath });
  if (probe.ok) {
    console.log(`Steam login OK (${account})`);
    return;
  }

  if (!isPublishTty()) {
    fail(
      [
        `SteamCMD has no cached credentials for ${account}.`,
        `Log in once in a terminal, then run npm run publish again:`,
        `  ${steamCmd} +login ${account}`,
        `Full SteamCMD log: ${logPath}`,
      ].join("\n"),
    );
  }

  const loginCode = await runSteamCmdInteractiveLogin(steamCmd, account);
  if (loginCode !== 0) {
    fail(`SteamCMD login failed for ${account} (exit ${loginCode ?? "?"}).`);
  }

  const verify = await probeSteamCmdLogin(steamCmd, account, { logPath });
  if (!verify.ok) {
    fail(
      [
        `SteamCMD login finished, but cached credentials for ${account} are still missing.`,
        `Full SteamCMD log: ${logPath}`,
      ].join("\n"),
    );
  }
  console.log(`Steam login OK (${account})`);
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
  const logPath = steamCmdPublishLogPath(ROOT);
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

  await ensureSteamCmdLogin(steamCmd, account);

  console.log(
    isNewItem
      ? `Uploading src/${mod.folder}/ (new Workshop item)…`
      : `Uploading src/${mod.folder}/ → ${publishedFileId}…`,
  );

  const result = await runWorkshopUpload(steamCmd, account, vdfFile, {
    logPath,
    onStatus: (line) => {
      // Login lines already printed by ensureSteamCmdLogin.
      if (line.startsWith("Steam login")) return;
      console.log(line);
    },
  });

  if (workshopUploadSucceeded(result.out)) {
    if (isNewItem) {
      const newId = saveNewWorkshopId(mod, vdfFile);
      if (newId) console.log(`Workshop item ${newId} published.`);
    } else {
      console.log(`Workshop item ${publishedFileId} updated.`);
    }
    return;
  }

  failWorkshopUpload(mod.folder, account, steamCmd, result.out, logPath);
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

let steamCmd;
try {
  steamCmd = await ensureDedicatedSteamCmd(ROOT);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const account = steamAccountName();
const allMods = (await loadMods([], { includeDebugKit: false })).filter(
  (mod) => mod.root === "src" && mod.folder !== DEBUG_MOD_FOLDER,
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
const build = spawnSync(
  process.execPath,
  [join(ROOT, "scripts/build/esbuild.config.mjs"), "--mod", selected.folder],
  {
    stdio: "inherit",
    cwd: ROOT,
  },
);
if (build.status !== 0) process.exit(build.status ?? 1);

selected.outDir = publishStagingDir(selected.gameId);
if (!existsSync(join(selected.outDir, "main.js"))) {
  fail(`Publish staging missing main.js: ${selected.outDir}`);
}

await publishMod(steamCmd, account, selected);
console.log("Workshop upload finished.");
process.exit(0);
