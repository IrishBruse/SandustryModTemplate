import { disableSessionAutosave } from "./boot/autosave";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot/boot-menu";
import { settingOn } from "./boot/settings";
import { installStartSavePicker } from "./boot/start-save-picker";
import { installDebugCompanion } from "./f3/install";
import { modinfo } from "./mod";
import { logRendererReload } from "./reload/loader-health";
import { startLocalModReload } from "./reload/local-mod-reload";

const api = sandkit.api;

function registerSandkitGlobals(): void {
  const { enums, react } = sandkit;
  Object.assign(globalThis, { sandkit, api, enums, react });
}

if (!reloaded) {
  logRendererReload();
  registerSandkitGlobals();
  if (settingOn(api, "f12DevTools")) registerDevToolsShortcut();
}
// Also run after hot reload so a settings/code fix can still navigate from the main menu.
scheduleMainMenuBoot(api, !reloaded);

if (settingOn(api, "disableAutosave")) disableSessionAutosave();
installDebugCompanion(api, modinfo.id);
installStartSavePicker(modinfo.id);
startLocalModReload(api);

console.log(`${reloaded ? "reloaded" : "loaded"} — debug companion`);
