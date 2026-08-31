/**
 * Steam save helpers for F5 debug worlds.
 * Vanilla file: first line JSON meta, then gzip of `{ store, wall, matrix, shadow, authorization }`.
 */
import { gzipSync, gunzipSync } from "node:zlib";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { gameModDir } from "./mod-path.js";
import { sandustryUserDataDir } from "./paths.js";

const GZIP_MAGIC = [0x1f, 0x8b];

/** Same rules as Steam `sanitizeFileName` (dots stay). */
export function sanitizeSaveId(id) {
  return String(id)
    .replace(/[/\\?%*:|"<>\s]/g, "_")
    .slice(0, 200);
}

export function steamSavesDir(userData = sandustryUserDataDir()) {
  return join(userData, "saves");
}

export function steamLastPlayedPath(userData = sandustryUserDataDir()) {
  return join(userData, "meta", "lastPlayedGame.json");
}

/**
 * @param {string} filePath
 * @returns {{ meta: Record<string, unknown>; data: Record<string, unknown> }}
 */
export function parseSaveFile(filePath) {
  const buf = readFileSync(filePath);
  const newlineIndex = buf.indexOf(0x0a);
  if (newlineIndex === -1) throw new Error("Invalid save format: missing newline");
  const meta = JSON.parse(buf.subarray(0, newlineIndex).toString("utf8"));
  const dataPart = buf.subarray(newlineIndex + 1);
  const json =
    dataPart.length >= 2 && dataPart[0] === GZIP_MAGIC[0] && dataPart[1] === GZIP_MAGIC[1]
      ? gunzipSync(dataPart).toString("utf8")
      : dataPart.toString("utf8");
  return { meta, data: JSON.parse(json) };
}

/**
 * @param {{ meta: Record<string, unknown>; data: unknown }} save
 * @returns {Buffer}
 */
export function serializeSaveFile(save) {
  const metaLine = `${JSON.stringify(save.meta)}\n`;
  const compressed = gzipSync(Buffer.from(JSON.stringify(save.data), "utf8"));
  return Buffer.concat([Buffer.from(metaLine, "utf8"), compressed]);
}

/**
 * Prefer `{gameId}.save`, else the first `*.save` in the directory.
 * @param {string} dir
 * @param {string} gameId
 * @returns {string | null}
 */
export function pickSaveInDir(dir, gameId) {
  if (!existsSync(dir)) return null;
  const named = join(dir, `${sanitizeSaveId(gameId)}.save`);
  try {
    if (statSync(named).isFile()) return named;
  } catch {
    /* missing */
  }
  /** @type {string[]} */
  const found = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".save")) continue;
    const filePath = join(dir, name);
    try {
      if (statSync(filePath).isFile()) found.push(filePath);
    } catch {
      /* skip */
    }
  }
  found.sort();
  return found[0] ?? null;
}

/**
 * Installed OS mods folder first, then `mod/` static files, then the source folder.
 * @param {string} gameId
 * @param {string} sourceDir
 * @param {string} [installedDir]
 * @returns {string | null}
 */
export function findModSaveFile(gameId, sourceDir, installedDir = gameModDir(gameId)) {
  return (
    pickSaveInDir(installedDir, gameId) ??
    pickSaveInDir(join(sourceDir, "mod"), gameId) ??
    pickSaveInDir(sourceDir, gameId)
  );
}

/** @param {string} saveId */
export function writeSteamLastPlayed(saveId, userData = sandustryUserDataDir()) {
  const id = sanitizeSaveId(saveId);
  const metaDir = dirname(steamLastPlayedPath(userData));
  mkdirSync(metaDir, { recursive: true });
  writeFileSync(steamLastPlayedPath(userData), `${JSON.stringify({ id }, null, 2)}\n`);
}

/**
 * Copy a mod `.save` into Steam user-data so `?db_load=` can open it.
 * Returns `null` when the mod has no save (F5 should Continue).
 *
 * @param {{ gameId: string; dir: string }} mod
 * @param {string} [userData]
 * @param {string} [installedDir]
 * @returns {{ id: string; sourcePath: string; filePath: string } | null}
 */
export function installModSaveToSteam(mod, userData = sandustryUserDataDir(), installedDir) {
  const sourcePath = findModSaveFile(mod.gameId, mod.dir, installedDir);
  if (!sourcePath) return null;
  const parsed = parseSaveFile(sourcePath);
  const rawId = parsed.meta.id;
  const id = sanitizeSaveId(typeof rawId === "string" && rawId ? rawId : mod.gameId);
  if (!id) throw new Error("Save id is empty after sanitize");
  const destDir = steamSavesDir(userData);
  mkdirSync(destDir, { recursive: true });
  const filePath = join(destDir, `${id}.save`);
  copyFileSync(sourcePath, filePath);
  writeSteamLastPlayed(id, userData);
  return { id, sourcePath, filePath };
}
