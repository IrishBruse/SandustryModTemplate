import { safe } from "@modkit/utils";

/** Sentinel: resolve to the game's last played save at boot time. */
export const AUTO_LOAD_LAST_PLAYED = "__last__";

type ElectronBridge = {
  getLastPlayedGameSync?(): string | null;
  saveExistsSync?(id: string): boolean;
};

function electronBridge(): ElectronBridge | undefined {
  return (window as Window & { electron?: ElectronBridge }).electron;
}

/** `startSave` from Options → Mods → debug (default: last played). */
export function getStartSaveSetting(api: SandkitApi): string {
  const value = safe(() => api.settings.get("startSave"));
  if (typeof value === "string" && value) return value;
  return AUTO_LOAD_LAST_PLAYED;
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
      if (typeof bridge.saveExistsSync === "function" && !bridge.saveExistsSync(id)) {
        return null;
      }
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

/** Save id to pass to `?db_load=` for the current mod setting. */
export function resolveAutoLoadSaveId(api: SandkitApi): string | null {
  const pref = getStartSaveSetting(api);
  if (pref !== AUTO_LOAD_LAST_PLAYED) {
    const bridge = electronBridge();
    if (typeof bridge?.saveExistsSync === "function") {
      if (bridge.saveExistsSync(pref)) return pref;
    } else {
      return pref;
    }
  }
  return getLastPlayedSaveId();
}
