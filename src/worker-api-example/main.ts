import { installDebug, isHotReloadEval } from "./debug";
import { isEnabled, safe } from "@modkit/utils";
import { installGlobals, MOD_ID } from "./globals";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installDebug(api, MOD_ID);

if (isEnabled(api)) {
  safe(() => {
    if (!reloaded) {
      api.ui.toast("Worker API Example loaded — check worker console for probe", {});
    }
  });
}

console.log(`[${MOD_ID}] main ${reloaded ? "reloaded" : "loaded"} — workerEntry probes types/worker-api`);
