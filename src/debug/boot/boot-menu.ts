import { inGame } from "@modkit/utils";
import { resolveAutoLoadSaveId } from "./auto-load-save";
import { autoLoadOn, settingOn } from "./settings";

/** Once per browser session — skip auto-load after exit to main menu (page reload). */
const AUTO_LOAD_SESSION_KEY = "irishbruse.debug:autoLoadDone";

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

function autoLoadSessionDone(): boolean {
  try {
    return sessionStorage.getItem(AUTO_LOAD_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markAutoLoadSessionDone(): void {
  try {
    sessionStorage.setItem(AUTO_LOAD_SESSION_KEY, "1");
  } catch {
    /* sessionStorage can throw in some embeds */
  }
}

/**
 * Reload with `?db_load=<saveId>` (same navigation the game uses for Continue).
 * Returns true when navigation started (the page will unload).
 * Only runs on the first mod eval in a session (`initialBoot`); not after exit to menu or hot reload.
 */
function tryAutoLoadSave(api: SandkitApi, initialBoot: boolean): boolean {
  if (inGame() || isBootQueryActive()) {
    markAutoLoadSessionDone();
    return false;
  }
  if (!initialBoot || autoLoadSessionDone()) return false;

  const saveId = resolveAutoLoadSaveId(api);
  if (!saveId) return false;

  markAutoLoadSessionDone();
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("db_load", saveId);
  location.assign(url.toString());
  return true;
}

/**
 * Optionally auto-load the chosen save on initial boot, then open DevTools on first load.
 * Safe to call again after hot reload (auto-load and DevTools open only when `firstLoad`).
 */
export function scheduleMainMenuBoot(api: SandkitApi, firstLoad = true): void {
  if (firstLoad && autoLoadOn(api) && tryAutoLoadSave(api, true)) return;
  if (firstLoad && settingOn(api, "openDevTools")) openDevToolsOnStartup();
}
