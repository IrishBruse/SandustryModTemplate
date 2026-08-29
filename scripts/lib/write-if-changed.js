/**
 * Skip disk writes when output text is unchanged.
 * Avoids bumping mtimes when a watch polls mod folders for content changes.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * @param {string} filePath
 * @param {string} next
 * @returns {boolean} `true` when the file was written
 */
export function writeTextIfChanged(filePath, next) {
  if (existsSync(filePath)) {
    const prev = readFileSync(filePath, "utf8");
    if (prev === next) return false;
  }
  writeFileSync(filePath, next);
  return true;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/**
 * Write JSON only when it differs from the file on disk.
 * Falls back to a semantic compare when formatting differs.
 *
 * @param {string} filePath
 * @param {unknown} value
 * @returns {boolean} `true` when the file was written
 */
export function writeJsonIfChanged(filePath, value) {
  const next = formatJson(value);
  if (existsSync(filePath)) {
    const prev = readFileSync(filePath, "utf8");
    if (prev === next) return false;
    try {
      if (JSON.stringify(JSON.parse(prev)) === JSON.stringify(value)) return false;
    } catch {
      /* invalid JSON on disk — rewrite */
    }
  }
  writeFileSync(filePath, next);
  return true;
}
