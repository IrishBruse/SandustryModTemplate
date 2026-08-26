import { disableSessionAutosave } from "./boot/autosave";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot/boot-menu";
import { settingOn } from "./boot/settings";
import { writeSkipShaderRecomp } from "./boot/skip-shader-recomp";
import { installDebugCompanion } from "./f3/install";
import { installModInspector } from "./mod-inspector/install";
import { modinfo } from "./modinfo";
import { installLocalModReload } from "./reload/install.ts";
import { isEnabled } from "modkit/utils";

const api = sandkit.api;

let stopLocalReload: (() => void) | undefined;

function syncLocalModReload(): void {
  const on = settingOn(api, "watchLocalMods");
  if (on && !stopLocalReload) stopLocalReload = installLocalModReload(api, modinfo.id);
  if (!on && stopLocalReload) {
    stopLocalReload();
    stopLocalReload = undefined;
  }
}

/** Persist skip so the next boot skips compiles that run before this main.js. */
function syncSkipShaderRecomp(): void {
  writeSkipShaderRecomp(settingOn(api, "skipShaderRecomp"));
}

function main() {
  if (!isEnabled(api)) return;

  const { enums, react } = sandkit;
  Object.assign(globalThis, { sandkit, api, enums, react });

  syncSkipShaderRecomp();
  if (settingOn(api, "f12DevTools")) registerDevToolsShortcut();
  scheduleMainMenuBoot(api);
  if (settingOn(api, "disableAutosave")) disableSessionAutosave();
  installDebugCompanion(api, modinfo.id);
  installModInspector(api, modinfo.id);
  syncLocalModReload();
  api.settings.onChange(() => {
    syncSkipShaderRecomp();
    syncLocalModReload();
  });

  console.log("loaded — debug companion");
}

main();
