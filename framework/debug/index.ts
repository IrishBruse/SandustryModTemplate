import type { SandkitApi } from "types/api";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot-menu";
import { installHotReload, isHotReloadEval } from "./hot-reload";

export { isHotReloadEval, onDispose } from "./hot-reload";

/** Expose sandkit on globalThis for DevTools and dump scripts. */
function registerSandkitGlobals(api: SandkitApi): void {
  const { enums, react } = sandkit;
  globalThis.sandkit = sandkit;
  globalThis.api = api;
  globalThis.enums = enums;
  globalThis.react = react;
}

/** DevTools, splash skip, main-menu auto-boot, and hot reload (debug setting). */
export function installDebug(api: SandkitApi, modId: string): void {
  registerSandkitGlobals(api);
  if (!isHotReloadEval(modId)) {
    registerDevToolsShortcut();
    scheduleMainMenuBoot(api, modId);
  }
  installHotReload(api, modId);
}
