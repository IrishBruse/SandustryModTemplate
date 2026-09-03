/**
 * Steam save helpers for F5 debug worlds.
 * Vanilla file: first line JSON meta, then gzip of `{ store, wall, matrix, shadow, authorization }`.
 */
import { gzipSync, gunzipSync } from "node:zlib";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  readSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sandustryUserDataDir } from "./paths.js";

const REPO_ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const GZIP_MAGIC = [0x1f, 0x8b];
/** Same first-chunk size as Steam `get-save-files`. */
const SAVE_META_READ = 4096;

/** Debug Void size in cells. Divides fog (4) and wall tiles (16). */
export const DEBUG_SAVE_WIDTH = 1024;
export const DEBUG_SAVE_HEIGHT = 1024;
const CELL_SIZE_PX = 4;
const WALL_SECTION = 16;
const FOG_SCALE = 4;
const RLE_MAX = 65535;
const BLOCK_CELL = 15;

/** Same rules as Steam `sanitizeFileName` (dots stay). */
export function sanitizeSaveId(id) {
  return String(id)
    .replace(/[/\\?%*:|"<>\s]/g, "_")
    .slice(0, 200);
}

export function emptySaveFixturePath() {
  return join(REPO_ROOT, "modkit", "test", "fixtures", "Empty.save");
}

export function steamSavesDir(userData = sandustryUserDataDir()) {
  return join(userData, "saves");
}

export function steamLastPlayedPath(userData = sandustryUserDataDir()) {
  return join(userData, "meta", "lastPlayedGame.json");
}

/**
 * First-line save meta only (no gzip body). Matches Steam `get-save-files`.
 * @param {string} filePath
 * @returns {Record<string, unknown>}
 */
export function readSaveMetaLine(filePath) {
  const fd = openSync(filePath, "r");
  try {
    const buf = Buffer.alloc(SAVE_META_READ);
    const bytesRead = readSync(fd, buf, 0, SAVE_META_READ, 0);
    const chunk = buf.toString("utf8", 0, bytesRead);
    const newlineIndex = chunk.indexOf("\n");
    if (newlineIndex === -1) throw new Error("Invalid save format: missing newline");
    return JSON.parse(chunk.slice(0, newlineIndex));
  } finally {
    closeSync(fd);
  }
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
 * @param {Record<string, unknown>} meta
 * @param {string} filePath
 */
function saveTimestampMs(meta, filePath) {
  if (typeof meta.timestamp === "string") {
    const t = Date.parse(meta.timestamp);
    if (!Number.isNaN(t)) return t;
  }
  try {
    return statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

/**
 * @param {Record<string, unknown>} meta
 * @param {string} worldId
 */
function saveBelongsToWorld(meta, worldId) {
  const fromWorld = typeof meta.worldId === "string" ? meta.worldId : null;
  const fromId = typeof meta.id === "string" ? meta.id : null;
  return fromWorld === worldId || (fromWorld == null && fromId === worldId);
}

/**
 * Steam saves whose `worldId` is this debug world.
 *
 * @param {string} worldId
 * @param {string} [userData]
 * @returns {{ id: string; filePath: string; timestamp: string | null; timestampMs: number }[]}
 */
export function listSteamSavesForWorld(worldId, userData = sandustryUserDataDir()) {
  const id = sanitizeSaveId(worldId);
  const dir = steamSavesDir(userData);
  if (!id || !existsSync(dir)) return [];
  /** @type {{ id: string; filePath: string; timestamp: string | null; timestampMs: number }[]} */
  const found = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".save")) continue;
    const filePath = join(dir, name);
    try {
      if (!statSync(filePath).isFile()) continue;
      const meta = readSaveMetaLine(filePath);
      if (!saveBelongsToWorld(meta, id)) continue;
      const saveId =
        typeof meta.id === "string" && meta.id
          ? sanitizeSaveId(meta.id)
          : name.slice(0, -".save".length);
      if (!saveId) continue;
      const timestamp = typeof meta.timestamp === "string" ? meta.timestamp : null;
      found.push({
        id: saveId,
        filePath,
        timestamp,
        timestampMs: saveTimestampMs(meta, filePath),
      });
    } catch {
      /* skip unreadable */
    }
  }
  return found;
}

/**
 * Newest save in this world (`meta.timestamp`, then file mtime).
 *
 * @param {string} worldId
 * @param {string} [userData]
 * @returns {{ id: string; filePath: string; timestamp: string | null; timestampMs: number } | null}
 */
export function latestSteamSaveForWorld(worldId, userData = sandustryUserDataDir()) {
  const saves = listSteamSavesForWorld(worldId, userData);
  if (saves.length === 0) return null;
  saves.sort((a, b) => {
    if (b.timestampMs !== a.timestampMs) return b.timestampMs - a.timestampMs;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  return saves[0] ?? null;
}

/**
 * File id, WORLDS name, and `meta.id` are all `modinfo.id`.
 * @param {{ gameId: string }} mod
 */
export function debugSaveIdentity(mod) {
  const id = sanitizeSaveId(mod.gameId);
  if (!id) throw new Error("Save id is empty after sanitize");
  return { id, name: id };
}

/**
 * @param {{ meta: Record<string, unknown>; data: Record<string, unknown> }} parsed
 * @param {string} displayName
 */
function applySaveDisplayName(parsed, displayName) {
  parsed.meta.name = displayName;
  parsed.meta.worldName = displayName;
  const store = parsed.data.store;
  if (store && typeof store === "object") {
    const rec = /** @type {Record<string, unknown>} */ (store);
    const meta = rec.meta;
    if (meta && typeof meta === "object") {
      /** @type {Record<string, unknown>} */ (meta).worldName = displayName;
    }
  }
}

/**
 * @param {{ meta: Record<string, unknown>; data: Record<string, unknown> }} parsed
 * @param {string} id
 * @param {string} displayName
 */
function applySaveIdentity(parsed, id, displayName) {
  parsed.meta.id = id;
  parsed.meta.worldId = id;
  parsed.meta.timestamp = new Date().toISOString();
  parsed.meta.playTime = 0;
  applySaveDisplayName(parsed, displayName);
  const store = parsed.data.store;
  if (store && typeof store === "object") {
    const rec = /** @type {Record<string, unknown>} */ (store);
    const meta = rec.meta;
    if (meta && typeof meta === "object") {
      const storeMeta = /** @type {Record<string, unknown>} */ (meta);
      storeMeta.time = 0;
      storeMeta.worldId = id;
      storeMeta.worldName = displayName;
    }
  }
}

/**
 * @param {number} width
 * @param {number} height
 */
function emptyPackedGrid(width, height) {
  if (width % WALL_SECTION !== 0 || height % WALL_SECTION !== 0) {
    throw new Error(`Packed grid ${width}x${height} must divide by ${WALL_SECTION}`);
  }
  const tiles = (width / WALL_SECTION) * (height / WALL_SECTION);
  return {
    sections: [Array.from({ length: WALL_SECTION * WALL_SECTION }, () => 0)],
    data: [0, tiles],
    width,
    height,
  };
}

/**
 * @param {number} width
 * @param {number} height
 * @param {(x: number, y: number) => number} valueAt
 * @returns {number[]}
 */
function rleMatrix(width, height, valueAt) {
  /** @type {number[]} */
  const out = [];
  let prev = valueAt(0, 0);
  let run = 0;
  function flush() {
    while (run > 0) {
      const n = Math.min(run, RLE_MAX);
      out.push(prev, n);
      run -= n;
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = valueAt(x, y);
      if (run === 0) {
        prev = value;
        run = 1;
        continue;
      }
      if (value === prev) {
        run += 1;
        continue;
      }
      flush();
      prev = value;
      run = 1;
    }
  }
  flush();
  return out;
}

/**
 * Shrink a Void save to `width` x `height` cells. Puts a Block platform at centre.
 *
 * @param {{ meta: Record<string, unknown>; data: Record<string, unknown> }} parsed
 * @param {number} [width]
 * @param {number} [height]
 */
export function shrinkSaveWorld(parsed, width = DEBUG_SAVE_WIDTH, height = DEBUG_SAVE_HEIGHT) {
  if (width % FOG_SCALE !== 0 || height % FOG_SCALE !== 0) {
    throw new Error(`World ${width}x${height} must divide by ${FOG_SCALE} for fog`);
  }
  const data = parsed.data;
  const store = data.store;
  if (!store || typeof store !== "object") throw new Error("Save is missing store");
  const rec = /** @type {Record<string, unknown>} */ (store);

  const world = rec.world;
  if (!world || typeof world !== "object") throw new Error("Save is missing store.world");
  const worldRec = /** @type {Record<string, unknown>} */ (world);
  worldRec.size = { width, height };
  worldRec.horizon = Array.from({ length: width }, () => 0);
  worldRec.groundHorizon = Array.from({ length: width }, () => 0);
  worldRec.fixtures = [];
  worldRec.lights = [];
  worldRec.teleportZones = [];
  worldRec.sensors = [];

  rec.structures = [];
  rec.drones = [];
  rec.pipes = [];
  rec.worldItems = [];
  rec.projectiles = [];

  const platformY = Math.floor(height / 2);
  const platformX0 = Math.floor(width / 2) - 16;
  const platformX1 = platformX0 + 32;
  data.matrix = rleMatrix(width, height, (x, y) =>
    y >= platformY && y < platformY + 2 && x >= platformX0 && x < platformX1 ? BLOCK_CELL : 0,
  );

  const wall = data.wall;
  if (wall && typeof wall === "object") {
    const wallRec = /** @type {Record<string, unknown>} */ (wall);
    wallRec.tiles = emptyPackedGrid(width, height);
  }
  data.shadow = emptyPackedGrid(width, height);
  data.authorization = emptyPackedGrid(width, height);

  const mods = rec.mods;
  if (mods && typeof mods === "object") {
    const modsRec = /** @type {Record<string, unknown>} */ (mods);
    const map = modsRec.map;
    if (map && typeof map === "object") {
      const mapRec = /** @type {Record<string, unknown>} */ (map);
      const fogW = width / FOG_SCALE;
      const fogH = height / FOG_SCALE;
      mapRec.fogWidth = fogW;
      mapRec.fogHeight = fogH;
      mapRec.fogBuffer = [0, 255, fogW * fogH];
      mapRec.fogBufferCompressed = true;
      mapRec.revealed = true;
      mapRec.unlocked = true;
    }
    const prefab = modsRec.prefabData;
    if (prefab && typeof prefab === "object") {
      /** @type {Record<string, unknown>} */ (prefab).placements = [];
    }
  }

  const player = rec.player;
  if (player && typeof player === "object") {
    const playerRec = /** @type {Record<string, unknown>} */ (player);
    const hitW = typeof playerRec.width === "number" ? playerRec.width : 12;
    const hitH = typeof playerRec.height === "number" ? playerRec.height : 30;
    playerRec.x = (platformX0 + 16) * CELL_SIZE_PX - hitW / 2;
    playerRec.y = platformY * CELL_SIZE_PX - hitH;
    const velocity = playerRec.velocity;
    if (velocity && typeof velocity === "object") {
      const vel = /** @type {Record<string, unknown>} */ (velocity);
      if ("x" in vel) vel.x = 0;
      if ("y" in vel) vel.y = 0;
    }
  }
}

/**
 * Clone Empty.save with `id` and WORLDS name set.
 * @param {string} filePath
 * @param {string} id
 * @param {string} displayName
 */
export function writeNamedVoidSave(filePath, id, displayName) {
  const fixture = emptySaveFixturePath();
  if (!existsSync(fixture)) throw new Error(`Missing ${fixture}`);
  const parsed = parseSaveFile(fixture);
  applySaveIdentity(parsed, id, displayName);
  shrinkSaveWorld(parsed);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, serializeSaveFile(parsed));
}

/**
 * Update WORLDS name without replacing world data.
 * @param {string} filePath
 * @param {string} displayName
 */
export function setSaveDisplayName(filePath, displayName) {
  const parsed = parseSaveFile(filePath);
  applySaveDisplayName(parsed, displayName);
  writeFileSync(filePath, serializeSaveFile(parsed));
}

/**
 * Copy Empty.save with `id` and display name. Does not overwrite.
 *
 * @param {string} destDir
 * @param {string} saveId `modinfo.id`
 * @returns {{ id: string; created: boolean; filePath: string }}
 */
export function ensureNamedVoidSave(destDir, saveId) {
  const id = sanitizeSaveId(saveId);
  if (!id) throw new Error("Save id is empty after sanitize");
  mkdirSync(destDir, { recursive: true });
  const filePath = join(destDir, `${id}.save`);
  if (existsSync(filePath)) return { id, created: false, filePath };
  writeNamedVoidSave(filePath, id, id);
  return { id, created: true, filePath };
}

/** @param {string} saveId */
export function writeSteamLastPlayed(saveId, userData = sandustryUserDataDir()) {
  const id = sanitizeSaveId(saveId);
  const metaDir = dirname(steamLastPlayedPath(userData));
  mkdirSync(metaDir, { recursive: true });
  writeFileSync(steamLastPlayedPath(userData), `${JSON.stringify({ id }, null, 2)}\n`);
}

/**
 * Steam `{modinfo.id}.save`. Create a 1024 Void when missing.
 * Does not overwrite an existing Steam file. Does not change last-played.
 * Does not write into the mod source folder.
 *
 * @param {{ gameId: string; dir?: string; name?: string }} mod
 * @param {string} [userData]
 * @returns {{ id: string; created: boolean; filePath: string }}
 */
export function ensureModSteamSave(mod, userData = sandustryUserDataDir()) {
  const { id, name } = debugSaveIdentity(mod);
  const destDir = steamSavesDir(userData);
  mkdirSync(destDir, { recursive: true });
  const filePath = join(destDir, `${id}.save`);
  if (existsSync(filePath)) {
    return { id, created: false, filePath };
  }
  writeNamedVoidSave(filePath, id, name);
  return { id, created: true, filePath };
}

/**
 * Ensure the Steam debug Void for this mod. F5 and setup both use this.
 *
 * @param {{ gameId: string; dir?: string; name?: string }} mod
 * @param {string} [userData]
 */
export function ensureModDebugSaves(mod, userData = sandustryUserDataDir()) {
  return ensureModSteamSave(mod, userData);
}

/**
 * @param {{ gameId: string; dir?: string; name?: string; manifest?: { name?: unknown } }}[] mods
 * @param {string} [userData]
 */
export function ensureAllModDebugSaves(mods, userData = sandustryUserDataDir()) {
  return mods.map((mod) => ensureModDebugSaves({ gameId: mod.gameId, dir: mod.dir }, userData));
}

/**
 * Ensure a Steam debug Void for `?db_load=`. Does not overwrite.
 *
 * @param {{ gameId: string; dir?: string; name?: string }} mod
 * @param {string} [userData]
 */
export function installModSaveToSteam(mod, userData = sandustryUserDataDir()) {
  return ensureModDebugSaves(mod, userData);
}

/**
 * Replace the Steam debug save with a fresh 1024 Void.
 *
 * @param {{ gameId: string; dir?: string; name?: string; manifest?: { name?: unknown } }} mod
 * @param {string} [userData]
 */
export function rewriteModDebugSaves(mod, userData = sandustryUserDataDir()) {
  const { id, name } = debugSaveIdentity(mod);
  const filePath = join(steamSavesDir(userData), `${id}.save`);
  writeNamedVoidSave(filePath, id, name);
  return { id, filePath };
}
