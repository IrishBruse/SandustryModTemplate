import { installDebug, isHotReloadEval, onDispose } from "./debug";
import { createElement } from "react";
import { isEnabled, safe } from "../framework/sdk";
import { installGlobals, MOD_ID } from "./debug/globals";
import { ExampleStatusPanel } from "./ui/ExampleStatusPanel";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installDebug(api, MOD_ID);

const OVERLAY_ID = "example-status-panel";

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, () => createElement(ExampleStatusPanel, {}));
  if (!dispose) {
    console.warn(`[${MOD_ID}] UI panel registration failed`);
    return;
  }
  onDispose(dispose);
}

if (isEnabled(api)) {
  safe(() => {
    registerUi();
    if (!reloaded) api.ui.toast("Example mod loaded", {});
  });
}

console.log(`[${MOD_ID}] ${reloaded ? "reloaded" : "loaded"} — use window.api in DevTools`);
