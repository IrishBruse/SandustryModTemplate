import { safe } from "@modkit/utils";

/** Sentinel: resolve to the game's last played save at boot time. */
export const AUTO_LOAD_LAST_PLAYED = "__last__";

/** Sentinel: resolve to `api.storage` on this companion. */
export const AUTO_LOAD_FROM_STORAGE = "__storage__";

/**
 * Storage key other mods write with
 * `api.storage.set(DEBUG_MOD_ID, START_SAVE_STORAGE_KEY, saveId)`.
 * `DEBUG_MOD_ID` must match `modinfo.id` in `../mod.ts`.
 */
export const START_SAVE_STORAGE_KEY = "startSave";

/** Must match `modinfo.id` in `../mod.ts`. */
export const DEBUG_MOD_ID = "irishbruse.debug";

export type SaveFileInfo = {
  id: string;
  name?: string;
  worldName?: string;
  timestamp?: string;
};

type ElectronBridge = {
  getLastPlayedGameSync?(): string | null;
  saveExistsSync?(id: string): boolean;
  getSaveFiles?(): Promise<SaveFileInfo[]>;
};

function electronBridge(): ElectronBridge | undefined {
  return (window as Window & { electron?: ElectronBridge }).electron;
}

function saveExists(id: string): boolean {
  const bridge = electronBridge();
  if (typeof bridge?.saveExistsSync === "function") return bridge.saveExistsSync(id);
  return true;
}

/** `startSave` from Options → Mods → debug (default: mod storage). */
export function getStartSaveSetting(api: SandkitApi): string {
  const value = safe(() => api.settings.get("startSave"));
  if (typeof value === "string" && value) return value;
  return AUTO_LOAD_FROM_STORAGE;
}

/** Label for a save in the Start save picker. */
export function saveFileLabel(file: SaveFileInfo): string {
  const title = (file.name || "").trim() || file.id;
  const world = (file.worldName || "").trim();
  return world && world !== title ? `${title} (${world})` : title;
}

/** Local saves from the Electron bridge, newest first. */
export async function listSaveFiles(): Promise<SaveFileInfo[]> {
  const bridge = electronBridge();
  if (typeof bridge?.getSaveFiles !== "function") return [];
  try {
    const files = await bridge.getSaveFiles();
    return [...files].sort(
      (a, b) => Date.parse(b.timestamp || "") - Date.parse(a.timestamp || ""),
    );
  } catch {
    return [];
  }
}

/** Write or clear the companion storage key that **Mod storage** reads. */
export function setStorageSaveId(api: SandkitApi, saveId: string | null): void {
  safe(() => api.storage.ensure(DEBUG_MOD_ID));
  if (!saveId) {
    safe(() => api.storage.remove(DEBUG_MOD_ID, START_SAVE_STORAGE_KEY));
    return;
  }
  safe(() => api.storage.set(DEBUG_MOD_ID, START_SAVE_STORAGE_KEY, saveId));
}

/**
 * Last played save id — same source as the main-menu **Continue** button.
 * Electron: `getLastPlayedGameSync` + `saveExistsSync`. Else `localStorage.lastPlayedGame`.
 */
export function getLastPlayedSaveId(): string | null {
  const bridge = electronBridge();
  if (typeof bridge?.getLastPlayedGameSync === "function") {
    try {
      const raw = bridge.getLastPlayedGameSync();
      const id = raw ? (JSON.parse(raw) as { id?: unknown }).id : null;
      if (typeof id !== "string" || !id) return null;
      if (!saveExists(id)) return null;
      return id;
    } catch {
      return null;
    }
  }

  try {
    const raw = localStorage.getItem("lastPlayedGame");
    const id = raw ? (JSON.parse(raw) as { id?: unknown }).id : null;
    return typeof id === "string" && id ? id : null;
  } catch {
    return null;
  }
}

/**
 * Save id another mod stored on this companion:
 * `api.storage.set("irishbruse.debug", "startSave", saveId)`.
 */
export function getStorageSaveId(api: SandkitApi): string | null {
  safe(() => api.storage.ensure(DEBUG_MOD_ID));
  const value = safe(() => api.storage.get(DEBUG_MOD_ID, START_SAVE_STORAGE_KEY));
  if (typeof value !== "string" || !value) return null;
  if (value === AUTO_LOAD_LAST_PLAYED || value === AUTO_LOAD_FROM_STORAGE) return null;
  if (!saveExists(value)) return null;
  return value;
}

/** Save id to pass to `?db_load=` for the current mod setting. */
export function resolveAutoLoadSaveId(api: SandkitApi): string | null {
  const pref = getStartSaveSetting(api);
  if (pref === AUTO_LOAD_FROM_STORAGE) {
    return getStorageSaveId(api) ?? getLastPlayedSaveId();
  }
  if (pref !== AUTO_LOAD_LAST_PLAYED && saveExists(pref)) return pref;
  return getLastPlayedSaveId();
}
