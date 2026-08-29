import { disableSessionAutosave } from "./boot/autosave";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot/boot-menu";
import { syncFastBootPrefs } from "./boot/fast-boot";
import { settingOn } from "./boot/settings";
import { installDebugBadge } from "./debug-badge/install";
import { installDebugCompanion } from "./f3/install";
import { installModInspector } from "./mod-inspector/install";
import { modinfo } from "./modinfo";
import { installFirstLoadApiWrap } from "./reload/first-load-wrap.ts";
import { installLocalModReload } from "./reload/install.ts";
import { isEnabled } from "modkit/utils";

const api = sandkit.api;

let stopLocalReload: (() => void) | undefined;

function syncLocalModReload(): void {
  const testHost = (globalThis as typeof globalThis & { __sandustryTestHost?: boolean })
    .__sandustryTestHost;
  const on = testHost === true || settingOn(api, "watchLocalMods");
  if (on && !stopLocalReload) stopLocalReload = installLocalModReload(api, modinfo.id);
  if (!on && stopLocalReload) {
    stopLocalReload();
    stopLocalReload = undefined;
  }
}

/** Persist boot prefs so debugPatches can skip work that runs before this main.js. */
function syncBootPatches(): void {
  syncFastBootPrefs(api);
}

function main() {
  if (!isEnabled(api)) return;

  // Before other mods eval: wrap their sandkit so intercepted API calls log.
  installFirstLoadApiWrap(modinfo.id);

  const { enums, react } = sandkit;
  Object.assign(globalThis, { sandkit, api, enums, react });

  syncBootPatches();
  if (settingOn(api, "f12DevTools")) registerDevToolsShortcut();
  scheduleMainMenuBoot(api);
  if (settingOn(api, "disableAutosave")) disableSessionAutosave();
  installDebugBadge(api, modinfo.id);
  installDebugCompanion(api, modinfo.id);
  installModInspector(api, modinfo.id);
  syncLocalModReload();
  api.settings.onChange(() => {
    syncBootPatches();
    syncLocalModReload();
  });

  console.log("loaded — debug companion");
}

main();
