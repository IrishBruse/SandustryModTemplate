import type { SandkitApi } from "types/api";
import { debugEnabled, safe } from "../sdk";
import { clickContinueButton, isContinueButtonReady } from "./menu";
import { startSplashSkipPolling } from "./splash";

const BOOT_INTERVAL_MS = 250;
const FALLBACK_MS = 1000;

let booted = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;

function openDevTools(): void {
  const bridge = (window as Window & { electron?: { openDevTools(): void } })
    .electron;
  bridge?.openDevTools();
}

/** Open DevTools as soon as the mod loads (retries until the bridge is ready). */
export function openDevToolsOnStartup(): void {
  openDevTools();
  for (const delay of [250, 750, 1500, 3000]) {
    setTimeout(openDevTools, delay);
  }
}

/** F12 opens DevTools */
export function registerDevToolsShortcut(): void {
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.code !== "F12") return;
      event.preventDefault();
      event.stopPropagation();
      openDevTools();
    },
    true
  );
}

function stopBootPolling(): void {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function tryBoot(api: SandkitApi): void {
  if (booted || !debugEnabled(api)) return;
  if (!isContinueButtonReady()) return;
  if (!clickContinueButton()) return;

  booted = true;
  stopBootPolling();
  openDevTools();
}

function registerBootTrigger(api: SandkitApi, modId: string): void {
  safe(() =>
    api.triggers.register(`${modId}:main-menu-boot`, {
      interval: BOOT_INTERVAL_MS,
      callback: () => tryBoot(api)
    })
  );
}

function startBootPolling(api: SandkitApi, modId: string): void {
  if (booted || !debugEnabled(api)) return;

  tryBoot(api);
  if (booted) return;

  registerBootTrigger(api, modId);

  if (pollTimer !== null) return;
  pollTimer = setInterval(() => tryBoot(api), BOOT_INTERVAL_MS);
}

/**
 * Open DevTools on load. When debug is on, poll until Continue is ready and click it.
 */
export function scheduleMainMenuBoot(api: SandkitApi, modId: string): void {
  openDevToolsOnStartup();
  startSplashSkipPolling();

  if (!debugEnabled(api)) return;

  safe(() => api.events.on("game:ready", () => startBootPolling(api, modId)));
  startBootPolling(api, modId);
  setTimeout(() => startBootPolling(api, modId), FALLBACK_MS);
}
