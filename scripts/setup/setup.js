/**
 * Local dev setup: check the machine, extract Sandustry from app.asar, link logs.
 * Usage: npm run setup
 *
 * Checks: Node major, root npm packages, per-mod node_modules,
 * Sandustry binary, app.asar, Steam [mods] beta, sandkit in the extracted bundle.
 *
 * Layout:
 *   sandustry/<version>-<branch>/  app.asar files except node_modules (e.g. 0.5.5-mods)
 *   dist/        symlink (Linux) / junction (Windows) to sandustry mods folder
 *   logs/        symlink (Linux) / junction (Windows) to sandustry logs
 *                Linux: ~/.config/sandustry/logs
 *                Windows: %APPDATA%/sandustry/logs
 */
import { extractFile, listPackage } from "@electron/asar";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { asarExtractPath, asarRelPath } from "../lib/asar-path.js";
import {
  linkDirectory,
  samePath,
  sandustryLogsDir,
  sandustryModsDir,
  steamLibraryRoots,
} from "../lib/paths.js";
import { discoverMods, MOD_ROOTS } from "../lib/mods.js";
import { ensureRepoDistLink } from "../lib/mod-path.js";
import { SANDUSTRY, SANDUSTRY_DIR } from "../lib/sandustry-common.js";
import {
  BUNDLE_RELS,
  ensureExtractRoot,
  gameExtractFolderName,
  readBundleSandkitFromAsar,
  readGameVersionFromAsar,
  resolveGameBranchKey,
  sandustryExtractRoot,
  versionedExtractDir,
} from "../lib/sandustry-extract.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const ASAR = join(SANDUSTRY_DIR, "resources/app.asar");
const EXTRACT_ROOT = sandustryExtractRoot(ROOT);
const LOGS_SRC = sandustryLogsDir();
const LOGS_DEST = join(ROOT, "logs");
const MODS_DIR = sandustryModsDir();
const SANDUSTRY_APP_ID = "2764460";
/** Previous references/ folder (source extract, logs link, workshop copies). */
const LEGACY_REFERENCES = join(ROOT, "references");

function isExtractableAsarFile(relPath) {
  if (!relPath) return false;
  if (relPath === "node_modules" || relPath.startsWith("node_modules/")) return false;
  return true;
}

const IS_WIN = process.platform === "win32";

let failCount = 0;
let warnCount = 0;

function ok(message) {
  console.log(`ok    ${message}`);
}

function warn(message) {
  warnCount += 1;
  console.warn(`warn  ${message}`);
}

function fail(message) {
  failCount += 1;
  console.error(`FAIL  ${message}`);
}

function expectedNodeMajor() {
  try {
    return Number.parseInt(readFileSync(join(ROOT, ".nvmrc"), "utf8").trim(), 10);
  } catch {
    return 24;
  }
}

function checkNode() {
  const expected = expectedNodeMajor();
  const actual = Number.parseInt(process.versions.node, 10);
  if (actual === expected) {
    ok(`Node ${process.versions.node}`);
    return;
  }
  if (actual < expected) {
    fail(`Node ${process.versions.node} — this template needs Node ${expected} (.nvmrc).`);
    return;
  }
  warn(`Node ${process.versions.node} — this template targets Node ${expected}.`);
}

function checkRootInstall() {
  const esbuild = join(ROOT, "node_modules/esbuild");
  const asar = join(ROOT, "node_modules/@electron/asar");
  if (existsSync(esbuild) && existsSync(asar)) {
    ok("Root npm packages (esbuild, @electron/asar)");
    return;
  }
  fail("Root node_modules is incomplete. Run npm install in the repo root.");
}

function checkModPackageInstalls() {
  for (const root of MOD_ROOTS) {
    if (!existsSync(join(ROOT, root))) {
      fail(`${root}/ folder is missing.`);
      return;
    }
  }

  /** @type {string[]} */
  const missing = [];
  for (const { folder, root, dir } of discoverMods()) {
    if (!existsSync(join(dir, "package.json"))) continue;
    if (!existsSync(join(dir, "node_modules"))) missing.push(`${root}/${folder}`);
  }

  if (missing.length === 0) {
    ok("Mod npm packages (package.json in src/ or examples/)");
    return;
  }
  fail(
    `Missing node_modules in ${missing.join(", ")}. Run npm install inside each of those folders (root npm install does not).`,
  );
}

function checkGameBinary() {
  if (existsSync(SANDUSTRY)) {
    ok(`Sandustry binary: ${SANDUSTRY}`);
    return true;
  }

  fail(`Sandustry binary not found: ${SANDUSTRY}`);
  if (IS_WIN) {
    fail(
      'Set SANDUSTRY to Sandustry.exe, for example: $env:SANDUSTRY="C:\\Program Files (x86)\\Steam\\steamapps\\common\\Sandustry\\Sandustry.exe"',
    );
  } else {
    fail(
      "Set SANDUSTRY to the sandustry binary, for example: export SANDUSTRY=/path/to/steamapps/common/Sandustry/sandustry",
    );
  }
  return false;
}

function checkAsar() {
  if (existsSync(ASAR)) {
    ok(`Game asar: ${ASAR}`);
    return true;
  }
  fail(`Game asar not found: ${ASAR}`);
  fail("Install Sandustry from Steam and opt into the [mods] beta.");
  return false;
}

/** @param {string} installDir */
function appManifestPath(installDir) {
  const besideInstall = join(dirname(installDir), `appmanifest_${SANDUSTRY_APP_ID}.acf`);
  if (existsSync(besideInstall)) return besideInstall;

  for (const root of steamLibraryRoots()) {
    const candidate = join(root, "steamapps", `appmanifest_${SANDUSTRY_APP_ID}.acf`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/** @param {string} acfPath */
function readSteamBetaKey(acfPath) {
  const text = readFileSync(acfPath, "utf8");
  const match = text.match(/"(?:BetaKey|betakey)"\s+"([^"]*)"/i);
  return match ? match[1].trim() : "";
}

function checkSteamModsBeta() {
  const acf = appManifestPath(SANDUSTRY_DIR);
  if (!acf) {
    warn(
      "Steam appmanifest_2764460.acf not found. Could not confirm the [mods] beta. Setup still checks sandkit in the asar.",
    );
    return;
  }

  const beta = readSteamBetaKey(acf);
  if (beta.toLowerCase() === "mods") {
    ok(`Steam [mods] beta (${acf})`);
    return;
  }
  if (!beta) {
    warn(
      `Steam listing has no BetaKey (${acf}). Opt into [mods] (Library → Properties → Betas) if mods do not load.`,
    );
    return;
  }
  warn(`Steam beta is "${beta}", not [mods] (${acf}). Switch Betas to mods.`);
}

function removeLegacyReferencesDir() {
  if (!existsSync(LEGACY_REFERENCES)) return;
  rmSync(LEGACY_REFERENCES, { recursive: true, force: true });
  console.log("Removed legacy references/");
}

/**
 * @param {string[]} listed
 * @param {string | null | undefined} betaKey
 * @returns {{ folderName: string; sourceDest: string; bundleRel: string | null }}
 */
function resolveExtractTarget(listed, betaKey) {
  const version = readGameVersionFromAsar(ASAR, listed);
  const bundleProbe = readBundleSandkitFromAsar(ASAR, listed);
  const branchKey = resolveGameBranchKey(betaKey, bundleProbe?.hasSandkit ?? false);
  const folderName = gameExtractFolderName(version, branchKey);
  return {
    folderName,
    sourceDest: versionedExtractDir(EXTRACT_ROOT, folderName),
    bundleRel: bundleProbe?.rel ?? null,
  };
}

/** @param {string[]} listed @param {string} sourceDest */
function extractGameSource(listed, sourceDest, folderName) {
  rmSync(sourceDest, { recursive: true, force: true });
  mkdirSync(sourceDest, { recursive: true });

  let count = 0;
  for (const entry of listed) {
    const relPath = asarRelPath(entry);
    if (!isExtractableAsarFile(relPath)) continue;

    const dest = join(sourceDest, relPath);
    mkdirSync(dirname(dest), { recursive: true });
    try {
      writeFileSync(dest, extractFile(ASAR, asarExtractPath(entry)));
    } catch {
      continue;
    }
    count += 1;
  }

  if (count === 0) {
    fail("Extracted 0 files from app.asar.");
    return false;
  }

  ok(`Extracted ${count} asar files -> sandustry/${folderName}/`);
  return true;
}

/** @param {string | null} bundleRel @param {string} sourceDest @param {string} folderName */
function checkSandkitInBundle(bundleRel, sourceDest, folderName) {
  if (!bundleRel) {
    fail(`No ${BUNDLE_RELS.join(" or ")} in app.asar. Opt into the Steam [mods] beta.`);
    return;
  }

  const bundlePath = join(sourceDest, bundleRel);
  if (!existsSync(bundlePath)) {
    fail(`Extracted asar is missing ${bundleRel}.`);
    return;
  }

  const bundle = readFileSync(bundlePath, "utf8");
  if (bundle.includes("sandkit")) {
    ok(`sandkit in sandustry/${folderName}/${bundleRel} ([mods] branch)`);
    return;
  }
  fail(
    `sandustry/${folderName}/${bundleRel} has no sandkit. Opt into the Steam [mods] beta (Library → Properties → Betas).`,
  );
}

function ensureUserDataDirs() {
  mkdirSync(MODS_DIR, { recursive: true });
  mkdirSync(LOGS_SRC, { recursive: true });
  ok(`Game mods folder: ${MODS_DIR}`);
  ok(`Game logs folder: ${LOGS_SRC}`);
}

function syncDist() {
  try {
    const status = ensureRepoDistLink(ROOT, { quiet: true });
    if (status === "already") {
      ok(`Link dist/ -> ${MODS_DIR} (already linked)`);
      return;
    }
    if (status === "migrated") {
      ok(`Migrated dist/ per-mod links -> ${MODS_DIR}`);
      return;
    }
    ok(`Linked dist/ -> ${MODS_DIR}`);
  } catch (err) {
    fail(`Could not link dist/ to ${MODS_DIR}: ${err instanceof Error ? err.message : err}`);
  }
}

function syncLogs() {
  try {
    const stat = lstatSync(LOGS_DEST);
    if (stat.isSymbolicLink()) {
      const current = resolve(dirname(LOGS_DEST), readlinkSync(LOGS_DEST));
      if (samePath(current, LOGS_SRC)) {
        ok(`Link logs -> ${LOGS_SRC} (already linked)`);
        return;
      }
    }
    rmSync(LOGS_DEST, { recursive: true, force: true });
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  linkDirectory(LOGS_SRC, LOGS_DEST);
  if (!existsSync(LOGS_DEST)) {
    fail(`Could not link logs/ to ${LOGS_SRC}`);
    return;
  }
  ok(`Linked logs -> ${LOGS_SRC}`);
}

console.log("Sandustry mod template setup");
console.log("");

checkNode();
checkRootInstall();
checkModPackageInstalls();

const haveBinary = checkGameBinary();
const haveAsar = haveBinary && checkAsar();
if (haveBinary) checkSteamModsBeta();

removeLegacyReferencesDir();

if (haveAsar) {
  ensureExtractRoot(EXTRACT_ROOT);
  const listed = listPackage(ASAR, { isPack: false });
  const acf = appManifestPath(SANDUSTRY_DIR);
  const betaKey = acf ? readSteamBetaKey(acf) : "";
  const target = resolveExtractTarget(listed, betaKey);
  if (target && extractGameSource(listed, target.sourceDest, target.folderName)) {
    checkSandkitInBundle(target.bundleRel, target.sourceDest, target.folderName);
  }
}

ensureUserDataDirs();
syncDist();
syncLogs();

console.log("");
if (failCount > 0) {
  console.error(`Setup failed (${failCount} error${failCount === 1 ? "" : "s"}).`);
  console.error("Fix the FAIL lines, then run npm run setup again.");
  console.error("Help: docs/troubleshooting.md");
  process.exit(1);
}

if (warnCount > 0) {
  console.log(`Setup finished with ${warnCount} warning${warnCount === 1 ? "" : "s"}.`);
} else {
  console.log("Setup is ready.");
}
console.log("Next: npm run dev");
