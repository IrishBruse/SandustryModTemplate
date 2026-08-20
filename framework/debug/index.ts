import type { SandkitApi } from "types/api";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot-menu";

/** Expose sandkit.api on window for DevTools and dump scripts. */
function registerGlobalApi(api: SandkitApi): void {
  globalThis.api = api;
  window.api = api;
}

/** DevTools, splash skip, and main-menu auto-boot (controlled by mod debug setting). */
export function installDebug(api: SandkitApi, modId: string): void {
  registerGlobalApi(api);
  registerDevToolsShortcut();
  scheduleMainMenuBoot(api, modId);
}
