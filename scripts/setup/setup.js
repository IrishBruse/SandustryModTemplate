/**
 * Local dev setup: check the machine, extract Sandustry game source, link logs.
 * Usage: npm run setup
 *
 * Checks: Node major, root npm packages, modkit/types, per-mod node_modules,
 * Sandustry binary, app.asar, Steam [mods] beta, sandkit in the extracted bundle.
 *
 * Layout:
 *   sandustry/   game JS/JSON/HTML/CSS from app.asar
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
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
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

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const ASAR = join(SANDUSTRY_DIR, "resources/app.asar");
const SOURCE_DEST = join(ROOT, "sandustry");
const LOGS_SRC = sandustryLogsDir();
const LOGS_DEST = join(ROOT, "logs");
const MODS_DIR = sandustryModsDir();
const TYPES_SENTINEL = join(ROOT, "modkit/types/global.d.ts");
const SANDUSTRY_APP_ID = "2764460";
const BUNDLE_RELS = ["dist/js/bundle.js", "js/bundle.js"];
/** Previous references/ folder (source extract, logs link, workshop copies). */
const LEGACY_REFERENCES = join(ROOT, "references");

const SOURCE_EXTENSIONS = new Set([".js", ".json", ".html", ".css", ".txt", ".md"]);

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

function asarRelPath(listed) {
  return listed.replace(/^\//, "");
}

function isGameSourceFile(relPath) {
  if (relPath === "node_modules" || relPath.startsWith("node_modules/")) return false;
  return SOURCE_EXTENSIONS.has(extname(relPath));
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

function checkTypes() {
  if (existsSync(TYPES_SENTINEL)) {
    ok("modkit/types/ Sandkit API declarations");
    return;
  }
  fail("modkit/types/ is missing. Pull the latest template.");
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
  fail(`Missing node_modules in ${missing.join(", ")}. Run npm install.`);
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
function steamBetaKey(acfPath) {
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

  const beta = steamBetaKey(acf);
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

/** @param {string[]} listed */
function bundleRelFromListing(listed) {
  const rels = new Set(listed.map(asarRelPath));
  return BUNDLE_RELS.find((rel) => rels.has(rel)) ?? null;
}

/** @param {string[]} listed */
function extractGameSource(listed) {
  rmSync(SOURCE_DEST, { recursive: true, force: true });
  mkdirSync(SOURCE_DEST, { recursive: true });

  let count = 0;
  for (const entry of listed) {
    const relPath = asarRelPath(entry);
    if (!relPath || !isGameSourceFile(relPath)) continue;

    const dest = join(SOURCE_DEST, relPath);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, extractFile(ASAR, relPath));
    count += 1;
  }

  if (count === 0) {
    fail("Extracted 0 game source files from app.asar.");
    return;
  }
  ok(`Extracted ${count} game source files -> sandustry/`);
}

/** @param {string | null} bundleRel */
function checkSandkitInBundle(bundleRel) {
  if (!bundleRel) {
    fail(`No ${BUNDLE_RELS.join(" or ")} in app.asar. Opt into the Steam [mods] beta.`);
    return;
  }

  const bundlePath = join(SOURCE_DEST, bundleRel);
  if (!existsSync(bundlePath)) {
    fail(`Extracted asar is missing ${bundleRel}.`);
    return;
  }

  const bundle = readFileSync(bundlePath, "utf8");
  if (bundle.includes("sandkit")) {
    ok(`sandkit in sandustry/${bundleRel} ([mods] branch)`);
    return;
  }
  fail(
    `sandustry/${bundleRel} has no sandkit. Opt into the Steam [mods] beta (Library → Properties → Betas).`,
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
checkTypes();
checkModPackageInstalls();

const haveBinary = checkGameBinary();
const haveAsar = haveBinary && checkAsar();
if (haveBinary) checkSteamModsBeta();

removeLegacyReferencesDir();

if (haveAsar) {
  const listed = listPackage(ASAR, { isPack: false });
  const bundleRel = bundleRelFromListing(listed);
  extractGameSource(listed);
  checkSandkitInBundle(bundleRel);
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
