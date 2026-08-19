import { installDebug } from "./debug";
import { installGlobals, MOD_ID } from "./debug/globals";
import React, { createElement } from "./react";
import { ExampleStatusPanel } from "./ui/ExampleStatusPanel";
import { isEnabled, safe } from "./sdk/safe";

const api = sandkit.api;
installGlobals(api);

const OVERLAY_ID = "example-status-panel";

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, () => createElement(ExampleStatusPanel, {}));
  if (!dispose) {
    console.warn(`[${MOD_ID}] UI panel registration failed`);
  }
}

if (isEnabled(api)) {
  safe(() => {
    installDebug(api);
    registerUi();
    api.ui.toast("Example mod loaded", {});
  });
}

console.log(`[${MOD_ID}] loaded — use window.api in DevTools`);

void React;
