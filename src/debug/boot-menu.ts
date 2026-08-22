import { inGame, safe } from "@modkit/utils";
import { clickContinueButton, isContinueButtonReady } from "./menu";
import { settingOn } from "./settings";
import { startSplashSkipPolling } from "./splash";

const BOOT_INTERVAL_MS = 250;
const FALLBACK_MS = 1000;
/** Survives hot-reload eval so Escape-menu Continue is never auto-clicked. */
const BOOT_SESSION_KEY = "sandkit-debug-main-menu-booted";

let booted = readBootedFromSession();
let triggerRegistered = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;

function readBootedFromSession(): boolean {
  try {
    return sessionStorage.getItem(BOOT_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markBooted(): void {
  booted = true;
  try {
    sessionStorage.setItem(BOOT_SESSION_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
  stopBootPolling();
}

/**
 * Open Electron DevTools via the game bridge.
 * Pass `force: true` for an explicit user action (F12).
 * Do not open DevTools while an IDE debugger is attached on F5 — that steals CDP.
 * Prefer keeping **Open DevTools on load** off when using F5.
 */
function openDevTools(): void {
  const bridge = (window as Window & { electron?: { openDevTools(): void } }).electron;
  bridge?.openDevTools();
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

function stopBootPolling(): void {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function tryBoot(api: SandkitApi): void {
  if (booted || !settingOn(api, "autoBoot")) return;
  // Pause/escape menu also has a Continue row — only auto-click on the main menu.
  if (inGame()) return;
  if (!isContinueButtonReady()) return;

  // Claim before click so interval + trigger cannot both fire.
  markBooted();
  clickContinueButton();
  if (settingOn(api, "openDevTools")) openDevTools();
}

function registerBootTrigger(api: SandkitApi, modId: string): void {
  if (triggerRegistered) return;
  triggerRegistered = true;
  safe(() =>
    api.triggers.register(`${modId}:main-menu-boot`, {
      interval: BOOT_INTERVAL_MS,
      callback: () => tryBoot(api),
    }),
  );
}

function startBootPolling(api: SandkitApi, modId: string): void {
  if (booted || !settingOn(api, "autoBoot")) return;

  tryBoot(api);
  if (booted) return;

  registerBootTrigger(api, modId);

  if (pollTimer !== null) return;
  pollTimer = setInterval(() => tryBoot(api), BOOT_INTERVAL_MS);
}

/**
 * Open DevTools on load, skip splash, and poll until Continue is ready.
 */
export function scheduleMainMenuBoot(api: SandkitApi, modId: string): void {
  if (settingOn(api, "openDevTools")) openDevToolsOnStartup();
  if (settingOn(api, "skipSplash")) startSplashSkipPolling();

  if (!settingOn(api, "autoBoot")) return;

  safe(() => api.events.on("game:ready", () => startBootPolling(api, modId)));
  startBootPolling(api, modId);
  setTimeout(() => startBootPolling(api, modId), FALLBACK_MS);
}
