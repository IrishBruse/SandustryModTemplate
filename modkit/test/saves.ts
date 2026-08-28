import { gunzipSync } from "node:zlib";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sandustryUserDataDir } from "./paths.ts";

const GZIP_MAGIC = [0x1f, 0x8b];

export type SaveMeta = {
  id: string;
  name?: string;
  timestamp?: string;
};

export function parseSaveFile(filePath: string): { meta: SaveMeta; data: unknown } {
  const buf = readFileSync(filePath);
  const newlineIndex = buf.indexOf(0x0a);
  if (newlineIndex === -1) throw new Error("Invalid save format: missing newline");
  const meta = JSON.parse(buf.subarray(0, newlineIndex).toString("utf8")) as SaveMeta;
  const dataPart = buf.subarray(newlineIndex + 1);
  const json =
    dataPart.length >= 2 && dataPart[0] === GZIP_MAGIC[0] && dataPart[1] === GZIP_MAGIC[1]
      ? gunzipSync(dataPart).toString("utf8")
      : dataPart.toString("utf8");
  return { meta, data: JSON.parse(json) };
}

export function readSaveMetaLine(filePath: string): SaveMeta | null {
  try {
    const buf = readFileSync(filePath);
    const newlineIndex = buf.indexOf(0x0a);
    if (newlineIndex === -1) return null;
    return JSON.parse(buf.subarray(0, newlineIndex).toString("utf8")) as SaveMeta;
  } catch {
    return null;
  }
}

/** Last played save id from the Steam user-data folder, if the file exists. */
export function steamLastPlayedSave(): { id: string; filePath: string } | null {
  const userData = sandustryUserDataDir();
  const lastPath = join(userData, "meta", "lastPlayedGame.json");
  if (!existsSync(lastPath)) return null;
  try {
    const parsed = JSON.parse(readFileSync(lastPath, "utf8")) as { id?: unknown };
    if (typeof parsed.id !== "string" || !parsed.id) return null;
    const filePath = join(userData, "saves", `${parsed.id}.save`);
    if (!existsSync(filePath)) return null;
    return { id: parsed.id, filePath };
  } catch {
    return null;
  }
}

export const FALLBACK_SETTINGS = {
  settingsVersion: 12,
  windowMode: "windowed",
  autosaveInterval: 0,
  locale: "en",
  sound: { masterVolume: 0, sfxVolume: 0, musicVolume: 0 },
};

export function steamSettingsJson(): string {
  const filePath = join(sandustryUserDataDir(), "meta", "settings.json");
  if (existsSync(filePath)) return readFileSync(filePath, "utf8");
  return JSON.stringify(FALLBACK_SETTINGS);
}

/** Tracked Void save used by the Chromium integration host. */
export function emptySaveFixturePath(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "fixtures", "Empty.save");
}

/**
 * Copy `Empty.save` into the test saves folder as `{meta.id}.save`.
 * Vanilla load uses that id (`?db_load=`).
 */
export function installEmptySave(destDir: string): { id: string; data: unknown } {
  const fixture = emptySaveFixturePath();
  if (!existsSync(fixture)) {
    throw new Error(`Missing ${fixture}`);
  }
  const parsed = parseSaveFile(fixture);
  const id = parsed.meta.id;
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Empty.save has no meta.id");
  }
  mkdirSync(destDir, { recursive: true });
  copyFileSync(fixture, join(destDir, `${id}.save`));
  return { id, data: parsed.data };
}
