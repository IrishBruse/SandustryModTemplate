import type { SandkitApi } from "types/api";
import { sandkit } from "../sandkit";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot-menu";
import { installHotReload, isHotReloadEval } from "./hot-reload";

export { isHotReloadEval, onDispose } from "./hot-reload";

/** Expose sandkit on globalThis for DevTools and dump scripts (console only). */
function registerSandkitGlobals(api: SandkitApi): void {
  const { enums, react } = sandkit;
  Object.assign(globalThis, { sandkit, api, enums, react });
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
