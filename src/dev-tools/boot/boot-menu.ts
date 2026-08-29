import { inGame } from "@modkit/utils";
import { resolveAutoLoadSaveId } from "./auto-load-save";
import {
  autoLoadSessionDone,
  buildAutoLoadUrl,
  isBootQueryActive,
  markAutoLoadSessionDone,
  shouldAutoLoad,
} from "./auto-load";
import { autoLoadOn, settingOn } from "./settings";

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

/**
 * Reload with `?db_load=<saveId>` (same navigation the game uses for Continue).
 * Returns true when navigation started (the page will unload).
 * Only runs on the first mod eval in a session (`initialBoot`); not after exit to menu.
 */
function tryAutoLoadSave(api: SandkitApi, initialBoot: boolean): boolean {
  if (inGame() || isBootQueryActive()) {
    markAutoLoadSessionDone();
    return false;
  }
  if (!initialBoot || autoLoadSessionDone()) return false;

  const saveId = resolveAutoLoadSaveId(api);
  if (
    !shouldAutoLoad({
      search: window.location.search,
      autoLoadEnabled: autoLoadOn(api),
      saveId,
      sessionDone: false,
      inGame: false,
    })
  ) {
    return false;
  }

  markAutoLoadSessionDone();
  location.assign(buildAutoLoadUrl(saveId!).toString());
  return true;
}

/**
 * Optionally auto-load the chosen save on initial boot, then open DevTools on first load.
 */
export function scheduleMainMenuBoot(api: SandkitApi, firstLoad = true): void {
  if (firstLoad && autoLoadOn(api) && tryAutoLoadSave(api, true)) return;
  if (firstLoad && settingOn(api, "openDevTools")) openDevToolsOnStartup();
}
