import type { SandkitApi } from "types/api";
import { clickContinueButton, isContinueButtonReady } from "./menu";
import { safe } from "../sdk/safe";
import { MOD_ID } from "./globals";

const AUTO_BOOT_KEY = `${MOD_ID}:autoBoot`;
const FALLBACK_MS = 4000;

let booted = false;

function autoBootEnabled(api: SandkitApi): boolean {
  safe(() => {
    const enabled = api.settings.get("autoBoot");
    localStorage.setItem(
      AUTO_BOOT_KEY,
      enabled === false ? "false" : "true",
    );
  });
  return localStorage.getItem(AUTO_BOOT_KEY) !== "false";
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

function tryBoot(api: SandkitApi): void {
  if (booted || !autoBootEnabled(api)) return;

  if (!isContinueButtonReady()) return;

  booted = true;
  openDevTools();

  if (!clickContinueButton()) {
    console.warn(`[${MOD_ID}] autoBoot: Continue button not ready`);
  }
}

function startBootPolling(api: SandkitApi): void {
  if (booted || !autoBootEnabled(api)) return;

  tryBoot(api);
  if (booted) return;

  safe(() =>
    api.triggers.register(
      `${MOD_ID}:main-menu-boot`,
      { intervalMs: 250, fn: () => tryBoot(api) },
      sandkit.state,
    ),
  );
}

/** Open DevTools and click Continue once the main menu button is on screen. */
export function scheduleMainMenuBoot(api: SandkitApi): void {
  if (!autoBootEnabled(api)) return;

  safe(() => api.events.on("game:ready", () => startBootPolling(api)));
  setTimeout(() => startBootPolling(api), FALLBACK_MS);
}
