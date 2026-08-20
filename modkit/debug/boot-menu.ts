import type { SandkitApi } from "types/api";
import { debugEnabled, inGame, safe } from "../utils";
import { clickContinueButton, isContinueButtonReady } from "./menu";
import { startSplashSkipPolling } from "./splash";

const BOOT_INTERVAL_MS = 250;
const FALLBACK_MS = 1000;
/** Survives hot-reload eval so Escape-menu Continue is never auto-clicked. */
const BOOT_SESSION_KEY = "sandkit-debug-main-menu-booted";
/**
 * Same default as `DEFAULT_RENDERER_DEBUG_PORT` in sandustry-common /
 * `.vscode/launch.json`. F5 and `sandustry:vscode` bind CDP here; opening
 * Electron DevTools on top of that drops the IDE debugger session.
 */
const REMOTE_DEBUG_PORT = 9222;

let booted = readBootedFromSession();
let triggerRegistered = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;
/** Cached probe: true when IDE/Chrome is attached via --remote-debugging-port. */
let remoteDebuggingProbe: Promise<boolean> | null = null;

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

function isRemoteDebuggingActive(): Promise<boolean> {
  if (remoteDebuggingProbe) return remoteDebuggingProbe;

  remoteDebuggingProbe = (async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 300);
    try {
      const res = await fetch(`http://127.0.0.1:${REMOTE_DEBUG_PORT}/json/version`, {
        signal: ctrl.signal,
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  })();

  return remoteDebuggingProbe;
}

/**
 * Open Electron DevTools via the game bridge.
 * Skips when CDP remote debugging is up so F5 / IDE attach is not stolen.
 * Pass `force: true` for an explicit user action (F12).
 */
function openDevTools(options?: { force?: boolean }): void {
  void isRemoteDebuggingActive().then((remote) => {
    if (remote && !options?.force) return;
    const bridge = (window as Window & { electron?: { openDevTools(): void } }).electron;
    bridge?.openDevTools();
  });
}

/** Open DevTools as soon as the mod loads (retries until the bridge is ready). */
export function openDevToolsOnStartup(): void {
  void isRemoteDebuggingActive().then((remote) => {
    if (remote) {
      console.info(
        `[modkit] remote debugging on :${REMOTE_DEBUG_PORT} — skipping Electron DevTools so the IDE debugger stays attached`,
      );
      return;
    }
    openDevTools();
    for (const delay of [250, 750, 1500, 3000]) {
      setTimeout(() => openDevTools(), delay);
    }
  });
}

/** F12 opens DevTools (may disconnect an IDE CDP session). */
export function registerDevToolsShortcut(): void {
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.code !== "F12") return;
      event.preventDefault();
      event.stopPropagation();
      openDevTools({ force: true });
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
  if (booted || !debugEnabled(api)) return;
  // Pause/escape menu also has a Continue row — only auto-click on the main menu.
  if (inGame()) return;
  if (!isContinueButtonReady()) return;

  // Claim before click so interval + trigger cannot both fire.
  markBooted();
  clickContinueButton();
  openDevTools();
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
