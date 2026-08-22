import { installHotReload, isHotReloadEval } from "./debug";
import { isEnabled, safe } from "@modkit/utils";
import { installGlobals, MOD_ID } from "./globals";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installHotReload(api, MOD_ID);

if (isEnabled(api)) {
  safe(() => {
    if (!reloaded) api.ui.toast("Hello Toast Example loaded", {});
  });
}

console.log(`[${MOD_ID}] ${reloaded ? "reloaded" : "loaded"} — use api in DevTools`);
