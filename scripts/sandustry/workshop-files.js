/**
 * Files under `src/<name>/workshop/` (Steam listing assets).
 * The build copies `workshop.json` and previews to the installed mod root.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

export const WORKSHOP_PREVIEW_NAMES = ["preview.gif", "preview.png"];
const SCREENSHOT_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);
const PUBLISHED_FILE_ID_PATTERN = /^[1-9]\d*$/;

/** @param {string} modDir */
export function workshopDir(modDir) {
  return join(modDir, "workshop");
}

/**
 * @param {string} modDir
 * @returns {{ schemaVersion: 1; publishedFileId: string } | null}
 */
export function readWorkshopManifest(modDir) {
  const file = join(workshopDir(modDir), "workshop.json");
  if (!existsSync(file)) return null;
  const value = JSON.parse(readFileSync(file, "utf8"));
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    value.schemaVersion !== 1 ||
    typeof value.publishedFileId !== "string" ||
    !PUBLISHED_FILE_ID_PATTERN.test(value.publishedFileId)
  ) {
    throw new Error(`Invalid workshop.json: ${file}`);
  }
  return {
    schemaVersion: 1,
    publishedFileId: value.publishedFileId,
  };
}

/** @param {string} modDir @returns {string | null} */
export function workshopPreviewPath(modDir) {
  for (const name of WORKSHOP_PREVIEW_NAMES) {
    const file = join(workshopDir(modDir), name);
    if (existsSync(file)) return file;
  }
  return null;
}

/** @param {string} modDir @returns {string | null} */
export function workshopDescriptionText(modDir) {
  const file = join(workshopDir(modDir), "workshop.txt");
  if (!existsSync(file)) return null;
  const text = readFileSync(file, "utf8").trim();
  return text.length > 0 ? text : null;
}

/** @param {string} modDir @returns {string[]} Absolute image paths, name-sorted. */
export function workshopScreenshotPaths(modDir) {
  const dir = join(workshopDir(modDir), "screenshots");
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return [];
  return readdirSync(dir)
    .filter((name) => SCREENSHOT_EXT.has(extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => join(dir, name));
}

/**
 * Copy `workshop/screenshots/` into the installed mod so SteamCMD uploads them with the item.
 * @param {string} modDir
 * @param {string} outDir
 * @returns {string[]} Copied source paths
 */
export function copyWorkshopScreenshots(modDir, outDir) {
  const files = workshopScreenshotPaths(modDir);
  if (files.length === 0) return files;
  const destDir = join(outDir, "screenshots");
  mkdirSync(destDir, { recursive: true });
  for (const from of files) {
    cpSync(from, join(destDir, basename(from)), { force: true });
  }
  return files;
}

/**
 * Copy listing files the game expects at the installed mod root.
 * @param {string} modDir
 * @param {string} outDir
 */
export function copyWorkshopInstallFiles(modDir, outDir) {
  const json = join(workshopDir(modDir), "workshop.json");
  if (existsSync(json)) {
    cpSync(json, join(outDir, "workshop.json"), { force: true });
  }
  for (const name of WORKSHOP_PREVIEW_NAMES) {
    const from = join(workshopDir(modDir), name);
    if (!existsSync(from)) continue;
    cpSync(from, join(outDir, name), { force: true });
  }
}
