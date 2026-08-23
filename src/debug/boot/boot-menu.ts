import { inGame } from "@modkit/utils";
import { resolveAutoLoadSaveId } from "./auto-load-save";
import { autoLoadOn, settingOn } from "./settings";

/** Query keys that already start a game boot (same list as the game bundle). */
const BOOT_QUERY_KEYS = [
  "new_game",
  "load",
  "db_load",
  "file_load",
  "custom_map",
  "external_map",
] as const;

type ElectronBridge = {
  openDevTools(): void;
};

function electronBridge(): ElectronBridge | undefined {
  return (window as Window & { electron?: ElectronBridge }).electron;
}

/**
 * Open Electron DevTools via the game bridge.
 * Do not open DevTools while an IDE debugger is attached on F5 — that steals CDP.
 * Prefer keeping **Open DevTools on load** off when using F5.
 */
function openDevTools(): void {
  electronBridge()?.openDevTools();
}

/** Open DevTools as soon as the mod loads (retries until the bridge is ready). */
export function openDevToolsOnStartup(): void {
  openDevTools();
  for (const delay of [250, 750, 1500, 3000]) {
    setTimeout(() => openDevTools(), delay);
  }
}

/** F12 opens DevTools (may disconnect an IDE CDP session). */
export function registerDevToolsShortcut(): void {
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.code !== "F12") return;
      event.preventDefault();
      event.stopPropagation();
      openDevTools();
    },
    true,
  );
}

/** True when the page URL already asks the game to boot a world. */
function isBootQueryActive(): boolean {
  const params = new URLSearchParams(window.location.search);
  return BOOT_QUERY_KEYS.some((key) => params.has(key));
}

/**
 * Reload with `?db_load=<saveId>` (same navigation the game uses for Continue).
 * Returns true when navigation started (the page will unload).
 */
function tryAutoLoadSave(api: SandkitApi): boolean {
  if (inGame() || isBootQueryActive()) return false;

  const saveId = resolveAutoLoadSaveId(api);
  if (!saveId) return false;

  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("db_load", saveId);
  location.assign(url.toString());
  return true;
}

/**
 * Optionally auto-load the chosen save, then open DevTools on first load.
 * Safe to call again after hot reload (DevTools open only when `firstLoad`).
 */
export function scheduleMainMenuBoot(api: SandkitApi, firstLoad = true): void {
  if (autoLoadOn(api) && tryAutoLoadSave(api)) return;
  if (firstLoad && settingOn(api, "openDevTools")) openDevToolsOnStartup();
}
