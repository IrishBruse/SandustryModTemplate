/**
 * Populate references/ from Sandustry app.asar, Steam Workshop subscriptions,
 * and a symlink to ~/.config/sandustry/logs.
 * Does not wipe workshop copies — only creates or updates individual paths.
 * Usage: npm run references
 *
 * Layout:
 *   references/source/   game JS/JSON/HTML/CSS from app.asar
 *   references/logs/     symlink to ~/.config/sandustry/logs
 *   references/<mod-id>/ workshop copies
 */
import { extractFile, listPackage } from "@electron/asar";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SANDUSTRY_DIR } from "./sandustry-common.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const STEAM_APPS = join(SANDUSTRY_DIR, "../..");
const SANDUSTRY_APP_ID = "2764460";
const ASAR = join(SANDUSTRY_DIR, "resources/app.asar");
const WORKSHOP = join(STEAM_APPS, "workshop/content", SANDUSTRY_APP_ID);
const REFERENCES = join(ROOT, "references");
const SOURCE_DEST = join(REFERENCES, "source");
const LOGS_SRC = join(homedir(), ".config/sandustry/logs");
const LOGS_DEST = join(REFERENCES, "logs");

/** Old asar extracts that used to sit in references/. */
const LEGACY_ASAR_FILES = ["preload.js", "main.js", "local-mod-publisher.js"];

const SOURCE_EXTENSIONS = new Set([".js", ".json", ".html", ".css", ".txt", ".md"]);

function toKebabCase(id) {
  return id.toLowerCase().replace(/\./g, "-");
}

function asarRelPath(listed) {
  return listed.replace(/^\//, "");
}

function isGameSourceFile(relPath) {
  if (relPath === "node_modules" || relPath.startsWith("node_modules/")) return false;
  return SOURCE_EXTENSIONS.has(extname(relPath));
}

function removeLegacyAsarExtracts() {
  for (const file of LEGACY_ASAR_FILES) {
    const dest = join(REFERENCES, file);
    if (!existsSync(dest)) continue;
    rmSync(dest);
    console.log(`Removed legacy references/${file}`);
  }
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

  console.log(`Extracted ${count} game source files -> references/source/`);
}

function syncLogs() {
  if (!existsSync(LOGS_SRC)) {
    console.warn(`Sandustry logs not found: ${LOGS_SRC}`);
    return;
  }

  try {
    const stat = lstatSync(LOGS_DEST);
    if (stat.isSymbolicLink() && readlinkSync(LOGS_DEST) === LOGS_SRC) {
      console.log(`Symlink references/logs -> ${LOGS_SRC} (already linked)`);
      return;
    }
    rmSync(LOGS_DEST, { recursive: true, force: true });
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  symlinkSync(LOGS_SRC, LOGS_DEST);
  console.log(`Symlinked references/logs -> ${LOGS_SRC}`);
}

function syncWorkshopMods() {
  if (!existsSync(WORKSHOP)) {
    console.warn(`Steam Workshop folder not found: ${WORKSHOP}`);
    return;
  }

  console.log(`Workshop source: ${WORKSHOP}`);

  const entries = readdirSync(WORKSHOP, { withFileTypes: true }).filter((d) =>
    d.isDirectory(),
  );

  for (const entry of entries) {
    const src = join(WORKSHOP, entry.name);
    const modinfoPath = join(src, "modinfo.json");

    if (!existsSync(modinfoPath)) {
      console.warn(`Skipping ${entry.name}: no modinfo.json`);
      continue;
    }

    const modinfo = JSON.parse(readFileSync(modinfoPath, "utf8"));
    if (!modinfo.id) {
      console.warn(`Skipping ${entry.name}: modinfo.json has no id`);
      continue;
    }

    const dest = join(REFERENCES, toKebabCase(modinfo.id));
    mkdirSync(dest, { recursive: true });
    cpSync(src, dest, { recursive: true, force: true });
    console.log(`Copied ${basename(src)} -> references/${basename(dest)}`);
  }
}

mkdirSync(REFERENCES, { recursive: true });
removeLegacyAsarExtracts();
extractGameSource();
syncLogs();
syncWorkshopMods();
console.log("Done.");
