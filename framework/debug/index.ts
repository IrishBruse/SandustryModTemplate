import type { SandkitApi } from "types/api";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot-menu";
import { installHotReload, isHotReloadEval } from "./hot-reload";

export { isHotReloadEval, onDispose } from "./hot-reload";

/** Expose sandkit.api on window for DevTools and dump scripts. */
function registerGlobalApi(api: SandkitApi): void {
  globalThis.api = api;
  window.api = api;
}

/** DevTools, splash skip, main-menu auto-boot, and hot reload (debug setting). */
export function installDebug(api: SandkitApi, modId: string): void {
  registerGlobalApi(api);
  if (!isHotReloadEval(modId)) {
    registerDevToolsShortcut();
    scheduleMainMenuBoot(api, modId);
  }
  installHotReload(api, modId);
}
