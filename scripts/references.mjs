/**
 * Populate references/ from Sandustry app.asar and Steam Workshop subscriptions.
 * Does not wipe references/ — only creates or updates individual paths.
 * Usage: npm run references
 */
import { extractFile } from "@electron/asar";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SANDUSTRY_DIR = "/home/econn/games/SteamLibrary/steamapps/common/Sandustry";
const STEAM_APPS = join(SANDUSTRY_DIR, "../..");
const SANDUSTRY_APP_ID = "2764460";
const ASAR = join(SANDUSTRY_DIR, "resources/app.asar");
const WORKSHOP = join(STEAM_APPS, "workshop/content", SANDUSTRY_APP_ID);
const REFERENCES = join(ROOT, "references");

/** Paths inside app.asar to copy into references/ (no leading slash). */
const ASAR_FILES = ["preload.js", "main.js", "local-mod-publisher.js"];

function toKebabCase(id) {
  return id.toLowerCase().replace(/\./g, "-");
}

function extractFromAsar() {
  if (!existsSync(ASAR)) {
    console.warn(`Sandustry asar not found: ${ASAR}`);
    return;
  }

  for (const file of ASAR_FILES) {
    const dest = join(REFERENCES, file);
    writeFileSync(dest, extractFile(ASAR, file));
    console.log(`Extracted ${file} -> references/${file}`);
  }
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
extractFromAsar();
syncWorkshopMods();
console.log("Done.");
