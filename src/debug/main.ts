import { safe } from "@modkit/utils";
import { disableSessionAutosave } from "./autosave";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot-menu";
import { startLocalModReload } from "./local-mod-reload";
import { modinfo } from "./mod";
import { settingOn } from "./settings";
import { installDebugCompanion } from "./toggle/install";

const api = sandkit.api;

function registerSandkitGlobals(): void {
  const { enums, react } = sandkit;
  Object.assign(globalThis, { sandkit, api, enums, react });
}

if (!reloaded) {
  registerSandkitGlobals();
  if (settingOn(api, "f12DevTools")) registerDevToolsShortcut();
}
// Also run after hot reload so a settings/code fix can still navigate from the main menu.
scheduleMainMenuBoot(api, !reloaded);

safe(() => {
  if (settingOn(api, "disableAutosave")) disableSessionAutosave();
  installDebugCompanion(api, modinfo.id);
  startLocalModReload(api);
});

console.log(`${reloaded ? "reloaded" : "loaded"} — debug companion`);
