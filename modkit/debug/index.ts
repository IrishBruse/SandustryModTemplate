import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot-menu";
import { installHotReload, isHotReloadEval } from "./hot-reload";
import { installDebugToggle } from "./toggle/install";

export { isHotReloadEval, onDispose } from "./hot-reload";
export { debugOnlyConfigKeys, modkitDebugConfigSchema } from "./config-schema";

/** Expose sandkit on globalThis for DevTools and dump scripts (console only). */
function registerSandkitGlobals(api: SandkitApi): void {
  const { enums, react } = sandkit;
  Object.assign(globalThis, { sandkit, api, enums, react });
}

/** DevTools, splash skip, main-menu auto-boot, hot reload, and F3 debug toggle. */
export function installDebug(api: SandkitApi, modId: string): void {
  registerSandkitGlobals(api);
  if (!isHotReloadEval(modId)) {
    registerDevToolsShortcut();
    scheduleMainMenuBoot(api, modId);
  }
  installHotReload(api, modId);
  installDebugToggle(api, modId);
}
