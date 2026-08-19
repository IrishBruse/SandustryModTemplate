import type { SandkitApi } from "types/api";
import { MOD_ID } from "../debug/globals";
import { safe } from "../sdk/safe";
import { clickContinueButton, isContinueButtonReady } from "./menu";
import { startSplashSkipPolling } from "./splash";

const BOOT_INTERVAL_MS = 250;
const FALLBACK_MS = 1000;

let booted = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;

function autoBootEnabled(api: SandkitApi): boolean {
  const value = safe(() => api.settings.get("autoBoot"));
  return typeof value === "boolean" ? value : true;
}

function openDevTools(): void {
  safe(() => window.electron?.openDevTools?.());
}

/** Open DevTools as soon as the mod loads (retries until the bridge is ready). */
export function openDevToolsOnStartup(): void {
  openDevTools();
  for (const delay of [250, 750, 1500, 3000]) {
    setTimeout(openDevTools, delay);
  }
}

/** F12 opens DevTools (preload patches cannot target preload.js). */
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
  if (booted || !autoBootEnabled(api)) return;
  if (!isContinueButtonReady()) return;
  if (!clickContinueButton()) return;

  booted = true;
  stopBootPolling();
  openDevTools();
}

function registerBootTrigger(api: SandkitApi): void {
  safe(() =>
    api.triggers.register(`${MOD_ID}:main-menu-boot`, {
      interval: BOOT_INTERVAL_MS,
      callback: () => tryBoot(api),
    }),
  );
}

function startBootPolling(api: SandkitApi): void {
  if (booted || !autoBootEnabled(api)) return;

  tryBoot(api);
  if (booted) return;

  registerBootTrigger(api);

  if (pollTimer !== null) return;
  pollTimer = setInterval(() => tryBoot(api), BOOT_INTERVAL_MS);
}

/**
 * Open DevTools on load. When autoBoot is on, poll until Continue is ready and click it.
 */
export function scheduleMainMenuBoot(api: SandkitApi): void {
  openDevToolsOnStartup();
  startSplashSkipPolling();

  if (!autoBootEnabled(api)) return;

  safe(() => api.events.on("game:ready", () => startBootPolling(api)));
  startBootPolling(api);
  setTimeout(() => startBootPolling(api), FALLBACK_MS);
}
