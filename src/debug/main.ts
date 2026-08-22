import { onDispose } from "@modkit/debug";
import { safe } from "@modkit/utils";
import { disableSessionAutosave } from "./autosave";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot-menu";
import { modinfo } from "./mod";
import { settingOn } from "./settings";
import { installDebugToggle } from "./toggle/install";
import tailwindCss from "@modkit/ui/tailwind.css";

const api = sandkit.api;
function registerSandkitGlobals(): void {
  const { enums, react } = sandkit;
  Object.assign(globalThis, { sandkit, api, enums, react });
}

function installTailwind(): void {
  const id = `${modinfo.id}-tailwind`;
  document.getElementById(id)?.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = tailwindCss;
  document.head.appendChild(style);
  onDispose(() => style.remove());
}

if (!reloaded) {
  registerSandkitGlobals();
  if (settingOn(api, "f12DevTools")) registerDevToolsShortcut();
  scheduleMainMenuBoot(api, modinfo.id);
}

safe(() => {
  if (settingOn(api, "disableAutosave")) disableSessionAutosave();
  installTailwind();
  installDebugToggle(api, modinfo.id);
});

console.log(`${reloaded ? "reloaded" : "loaded"} — debug companion`);
