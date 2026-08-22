/**
 * Local dev setup: extract Sandustry game source and link logs.
 * Usage: npm run setup
 *
 * Layout:
 *   sandustry/   game JS/JSON/HTML/CSS from app.asar
 *   logs/        symlink (Linux) / junction (Windows) to sandustry logs
 *                Linux: ~/.config/sandustry/logs
 *                Windows: %APPDATA%/sandustry/logs
 */
import { extractFile, listPackage } from "@electron/asar";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { linkDirectory, samePath, sandustryLogsDir } from "./paths.js";
import { SANDUSTRY_DIR } from "./sandustry-common.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const ASAR = join(SANDUSTRY_DIR, "resources/app.asar");
const SOURCE_DEST = join(ROOT, "sandustry");
const LOGS_SRC = sandustryLogsDir();
const LOGS_DEST = join(ROOT, "logs");
/** Previous references/ folder (source extract, logs link, workshop copies). */
const LEGACY_REFERENCES = join(ROOT, "references");

const SOURCE_EXTENSIONS = new Set([".js", ".json", ".html", ".css", ".txt", ".md"]);

function asarRelPath(listed) {
  return listed.replace(/^\//, "");
}

function isGameSourceFile(relPath) {
  if (relPath === "node_modules" || relPath.startsWith("node_modules/")) return false;
  return SOURCE_EXTENSIONS.has(extname(relPath));
}

function removeLegacyReferencesDir() {
  if (!existsSync(LEGACY_REFERENCES)) return;
  rmSync(LEGACY_REFERENCES, { recursive: true, force: true });
  console.log("Removed legacy references/");
}

function extractGameSource() {
  if (!existsSync(ASAR)) {
    console.warn(`Sandustry asar not found: ${ASAR}`);
    return;
  }

  rmSync(SOURCE_DEST, { recursive: true, force: true });
  mkdirSync(SOURCE_DEST, { recursive: true });

  const listed = listPackage(ASAR, { isPack: false });
  let count = 0;

  for (const entry of listed) {
    const relPath = asarRelPath(entry);
    if (!relPath || !isGameSourceFile(relPath)) continue;

    const dest = join(SOURCE_DEST, relPath);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, extractFile(ASAR, relPath));
    count += 1;
  }

  console.log(`Extracted ${count} game source files -> sandustry/`);
}

function syncLogs() {
  if (!existsSync(LOGS_SRC)) {
    console.warn(`Sandustry logs not found: ${LOGS_SRC}`);
    return;
  }

  try {
    const stat = lstatSync(LOGS_DEST);
    if (stat.isSymbolicLink()) {
      const current = resolve(dirname(LOGS_DEST), readlinkSync(LOGS_DEST));
      if (samePath(current, LOGS_SRC)) {
        console.log(`Link logs -> ${LOGS_SRC} (already linked)`);
        return;
      }
    }
    rmSync(LOGS_DEST, { recursive: true, force: true });
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  linkDirectory(LOGS_SRC, LOGS_DEST);
  console.log(`Linked logs -> ${LOGS_SRC}`);
}

removeLegacyReferencesDir();
extractGameSource();
syncLogs();
console.log("Done.");
