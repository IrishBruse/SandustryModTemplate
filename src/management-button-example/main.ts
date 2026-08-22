import { installHotReload, isHotReloadEval, onDispose } from "./debug";
import { registerManagementMenuButton } from "@modkit/ui";
import { isEnabled, safe } from "@modkit/utils";
import { installGlobals, MOD_ID } from "./globals";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installHotReload(api, MOD_ID);

const TOOLS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor"><path d="M120-160v-640h80v640h-80Zm160-80v-480h80v480h-80Z"/></svg>`;

function registerToolsRow() {
  const stop = registerManagementMenuButton({
    id: `${MOD_ID}:tools`,
    icon: TOOLS_ICON,
    label: "Tools",
    hotkey: "F4",
    onClick: () => {
      api.ui.toast("Tools row clicked", {});
    },
  });
  onDispose(stop);
}

if (isEnabled(api)) {
  safe(() => {
    registerToolsRow();
  });
}

console.log(`[${MOD_ID}] ${reloaded ? "reloaded" : "loaded"} — Tools row under Upgrades`);
