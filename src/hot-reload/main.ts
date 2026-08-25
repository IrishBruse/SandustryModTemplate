import { disableSessionAutosave } from "./boot/autosave";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot/boot-menu";
import { settingOn } from "./boot/settings";
import { installDebugCompanion } from "./f3/install";
import { installModInspector } from "./mod-inspector/install";
import { modinfo } from "./mod";
import { isEnabled } from "modkit/utils";

const api = sandkit.api;

function main() {
  if (!isEnabled(api)) return;

  const { enums, react } = sandkit;
  Object.assign(globalThis, { sandkit, api, enums, react });

  if (settingOn(api, "f12DevTools")) registerDevToolsShortcut();
  scheduleMainMenuBoot(api);
  if (settingOn(api, "disableAutosave")) disableSessionAutosave();
  installDebugCompanion(api, modinfo.id);
  installModInspector(api, modinfo.id);

  console.log("loaded — debug companion");
}

main();
