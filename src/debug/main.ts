import { installHotReload, isHotReloadEval } from "@modkit/debug";
import { isEnabled } from "@modkit/utils";
import { disableSessionAutosave } from "./autosave";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot-menu";
import { installGlobals, MOD_ID } from "./globals";
import { settingOn } from "./settings";
import { installDebugToggle } from "./toggle/install";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installHotReload(api, MOD_ID);

function registerSandkitGlobals(): void {
  const { enums, react } = sandkit;
  Object.assign(globalThis, { sandkit, api, enums, react });
}

if (isEnabled(api) && !reloaded) {
  registerSandkitGlobals();
  if (settingOn(api, "f12DevTools")) registerDevToolsShortcut();
  scheduleMainMenuBoot(api, MOD_ID);
}

if (isEnabled(api)) {
  if (settingOn(api, "disableAutosave")) disableSessionAutosave();
  installDebugToggle(api, MOD_ID);
}

console.log(`[${MOD_ID}] ${reloaded ? "reloaded" : "loaded"} — debug companion`);
