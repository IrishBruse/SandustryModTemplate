import { inGame, safe } from "@modkit/utils";
import { clickContinueButton, isContinueButtonReady } from "./menu";
import { settingOn } from "./settings";
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
/** Set by F5 / sandustry:vscode (`sandustryDebugEnv`). Avoids HTTP to the CDP port. */
const IDE_DEBUG_ENV = "SANDUSTRY_IDE_DEBUG";
/** Written into each local mod folder by F5 / sandustry:vscode launch scripts. */
const IDE_DEBUG_MARKER = "ide-debug.json";

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

function readIdeDebugFlag(): boolean {
  try {
    const proc = (
      globalThis as { process?: { env?: Record<string, string | undefined>; argv?: string[] } }
    ).process;
    if (proc?.env?.[IDE_DEBUG_ENV] === "1") return true;
    return Boolean(proc?.argv?.some((arg) => arg.startsWith("--remote-debugging-port=")));
  } catch {
    return false;
  }
}

/**
 * Renderer has no `process.env`. F5 writes `ide-debug.json` into the mod folder;
 * sandkit serves it through `api.assets.getUrl`.
 */
async function readIdeDebugMarker(): Promise<boolean> {
  try {
    const url = sandkit.api.assets.getUrl(IDE_DEBUG_MARKER);
    if (!url) return false;
    const sep = url.includes("?") ? "&" : "?";
    const response = await fetch(`${url}${sep}t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return false;
    return (await response.text()).trim() === "1";
  } catch {
    return false;
  }
}

/**
 * True when the IDE launched with CDP. Do not `fetch` `:9222` from this page —
 * that HTTP call deadlocks Chromium once VS Code is attached.
 */
function isRemoteDebuggingActive(): Promise<boolean> {
  if (remoteDebuggingProbe) return remoteDebuggingProbe;
  remoteDebuggingProbe = (async () => {
    if (readIdeDebugFlag()) return true;
    return readIdeDebugMarker();
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
        `[debug] remote debugging on :${REMOTE_DEBUG_PORT} — skipping Electron DevTools so the IDE debugger stays attached`,
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
