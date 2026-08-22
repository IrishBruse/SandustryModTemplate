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

const CHANGELOG_HEADING = /^##\s+\[?([^\]]+?)\]?(?:\s*[-–—]\s*\d{4}-\d{2}-\d{2})?\s*$/;
const VERSION_TITLE = /^(\d+\.\d+\.\d+)\b/;
/** Steam Workshop changenote limit. */
const CHANGE_NOTE_MAX = 8000;

/**
 * @param {string} line
 * @returns {{ version: string | null } | null}
 */
function parseChangelogHeading(line) {
  const match = line.match(CHANGELOG_HEADING);
  if (!match) return null;
  const title = match[1].trim();
  if (/^unreleased$/i.test(title)) return { version: null };
  const version = title.match(VERSION_TITLE);
  if (!version) return null;
  return { version: version[1] };
}

/**
 * @param {string} markdown
 * @returns {{ version: string | null; body: string }[]}
 */
function changelogSections(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  /** @type {{ version: string | null; bodyLines: string[] }[]} */
  const sections = [];
  /** @type {{ version: string | null; bodyLines: string[] } | null} */
  let current = null;
  for (const line of lines) {
    const heading = parseChangelogHeading(line);
    if (heading) {
      if (current) sections.push(current);
      current = { version: heading.version, bodyLines: [] };
      continue;
    }
    if (current) current.bodyLines.push(line);
  }
  if (current) sections.push(current);
  return sections.map((section) => ({
    version: section.version,
    body: section.bodyLines.join("\n").trim(),
  }));
}

/**
 * @param {string} markdown
 * @returns {string}
 */
function changelogBodyToPlain(markdown) {
  return markdown
    .replaceAll(/\r\n/g, "\n")
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replaceAll(/\*\*([^*]+)\*\*/g, "$1")
    .replaceAll(/^###\s+/gm, "")
    .replaceAll(/`([^`]+)`/g, "$1")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Steam changenote from `CHANGELOG.md` for `modinfo.version`.
 * Prefers `## 1.2.3`. Falls back to `## Unreleased` when that version heading is missing.
 * @param {string} modDir
 * @param {string} version
 * @returns {{ text: string; source: "version" | "unreleased" } | null}
 */
export function readChangelogChangeNote(modDir, version) {
  const file = join(modDir, "CHANGELOG.md");
  if (!existsSync(file) || typeof version !== "string" || !version.trim()) return null;
  const wanted = version.trim();
  const sections = changelogSections(readFileSync(file, "utf8"));
  const versionSection = sections.find((section) => section.version === wanted && section.body);
  const unreleased = sections.find((section) => section.version == null && section.body);
  const picked = versionSection
    ? { body: versionSection.body, source: /** @type {const} */ ("version") }
    : unreleased
      ? { body: unreleased.body, source: /** @type {const} */ ("unreleased") }
      : null;
  if (!picked) return null;

  let text = `${wanted}\n\n${changelogBodyToPlain(picked.body)}`;
  if (text.length > CHANGE_NOTE_MAX) {
    text = `${text.slice(0, CHANGE_NOTE_MAX - 1).trimEnd()}…`;
  }
  return { text, source: picked.source };
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
