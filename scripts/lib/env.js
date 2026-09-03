/**
 * Load repo-root `.env` into `process.env` (does not override existing keys).
 * Call once at process start before reading SANDUSTRY / DEV_* settings.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const ENV_FILE = join(ROOT, ".env");

/** @type {boolean} */
let loaded = false;

/**
 * Parse dotenv-style text. Supports `KEY=value # comment` and quoted values.
 * @param {string} text
 * @returns {Record<string, string>}
 */
export function parseEnvText(text) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      const hash = value.indexOf(" #");
      if (hash >= 0) value = value.slice(0, hash).trimEnd();
    }
    out[key] = value;
  }
  return out;
}

/**
 * Apply `.env` keys that are not already set in `process.env`.
 * @param {{ root?: string, path?: string, force?: boolean }} [options]
 * @returns {Record<string, string>}
 */
export function loadRepoEnv(options = {}) {
  if (loaded && !options.force) return {};
  loaded = true;
  const path = options.path ?? (options.root ? join(options.root, ".env") : ENV_FILE);
  if (!existsSync(path)) return {};
  const parsed = parseEnvText(readFileSync(path, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  return parsed;
}

/**
 * Read a trimmed env string (after `loadRepoEnv`).
 * @param {string} key
 * @param {string} [fallback]
 */
export function envString(key, fallback = "") {
  loadRepoEnv();
  const value = process.env[key];
  if (value == null || value.trim() === "") return fallback;
  return value.trim();
}

/**
 * Truthy when value is `1` / `true` / `yes` / `on` (case-insensitive).
 * @param {string} key
 * @param {boolean} [fallback]
 */
export function envFlag(key, fallback = false) {
  const raw = envString(key, fallback ? "true" : "false").toLowerCase();
  if (["1", "true", "yes", "on"].includes(raw)) return true;
  if (["0", "false", "no", "off"].includes(raw)) return false;
  return fallback;
}

/**
 * @typedef {"all" | "selection" | "always"} DevModsMode
 */

/**
 * Resolve `DEV_MODS` into a watch/build policy.
 * - `all` — every mod under the active roots
 * - `selection` — `.tmp/dev-mod-selection.json` from F5 / `dev:pick` only
 * - comma list — those folders **always**, merged with the current selection
 * @param {string} [raw]
 * @returns {{ mode: DevModsMode, alwaysFolders: string[] }}
 */
export function resolveDevModsSetting(raw = envString("DEV_MODS", "selection")) {
  const value = raw.trim();
  if (!value || value.toLowerCase() === "selection") {
    return { mode: "selection", alwaysFolders: [] };
  }
  if (value.toLowerCase() === "all") return { mode: "all", alwaysFolders: [] };
  const alwaysFolders = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (alwaysFolders.length === 0) return { mode: "selection", alwaysFolders: [] };
  return { mode: "always", alwaysFolders };
}

/**
 * Merge F5 / picker selection with `DEV_MODS` always-folders.
 * `[]` means compile every mod in scope.
 * @param {DevModSelectionLike | null} selection
 * @param {{ mode: DevModsMode, alwaysFolders: string[] }} setting
 * @param {Set<string>} [validFolders]
 * @returns {string[]}
 *
 * @typedef {{ all: true } | { all: false, folders: string[] }} DevModSelectionLike
 */
export function watchModFolders(selection, setting, validFolders) {
  if (setting.mode === "all") return [];

  /** @param {string[]} folders */
  const keep = (folders) =>
    validFolders ? folders.filter((folder) => validFolders.has(folder)) : folders.slice();

  if (setting.mode === "selection") {
    if (!selection || selection.all) return [];
    return keep(selection.folders);
  }

  // always: union(selection, alwaysFolders). Selection "all" still means every mod.
  if (!selection || selection.all) return [];
  const merged = new Set([...keep(selection.folders), ...keep(setting.alwaysFolders)]);
  return [...merged].sort((a, b) => a.localeCompare(b));
}

/** Remove owned OS mod folders when `npm run dev` stops. Default off. */
export function resolveDevCleanup() {
  return envFlag("DEV_CLEANUP", false);
}

loadRepoEnv();
