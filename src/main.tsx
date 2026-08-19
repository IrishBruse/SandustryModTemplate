import { installDebug } from "../lib/debug";
import { createElement } from "../lib/react";
import { isEnabled, safe } from "../lib/sdk/safe";
import { installGlobals, MOD_ID } from "./debug/globals";
import { ExampleStatusPanel } from "./ui/ExampleStatusPanel";

const api = sandkit.api;
installGlobals(api);
installDebug(api, MOD_ID);

const OVERLAY_ID = "example-status-panel";

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, () => createElement(ExampleStatusPanel, {}));
  if (!dispose) {
    console.warn(`[${MOD_ID}] UI panel registration failed`);
  }
}

if (isEnabled(api)) {
  safe(() => {
    registerUi();
    api.ui.toast("Example mod loaded", {});
  });
}

console.log(`[${MOD_ID}] loaded — use window.api in DevTools`);
