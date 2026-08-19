import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./debug/boot-menu";
import { installGlobals, MOD_ID } from "./debug/globals";
import React, { createElement } from "./react";
import { ExampleStatusPanel } from "./ui/ExampleStatusPanel";
import { isEnabled, safe } from "./sdk/safe";

const api = sandkit.api;
const modGlobal = installGlobals(api);

const OVERLAY_LAYER = "global";
const OVERLAY_ID = "example-status-panel";

function renderStatusPanel() {
  return createElement(ExampleStatusPanel, {
    retroConsoleRegistered: modGlobal.status.retroConsole,
  });
}

function registerUi() {
  const ui = api.ui;

  const dispose =
    safe(() => ui.inject?.(OVERLAY_ID, renderStatusPanel)) ??
    safe(() => {
      ui.overlays.register(OVERLAY_LAYER, OVERLAY_ID, renderStatusPanel, sandkit.state);
      return () => ui.overlays.unregister(OVERLAY_LAYER, OVERLAY_ID, sandkit.state);
    });

  if (!dispose) {
    console.warn(`[${MOD_ID}] UI panel registration failed`);
    return;
  }

  // inject mounts into the game React tree; overlays need explicit refresh on scene changes.
  if (!ui.inject) {
    safe(() =>
      api.triggers.register(`${MOD_ID}:status-panel-refresh`, {
        interval: 500,
        callback: () => ui.overlays.update(OVERLAY_LAYER),
      }),
    );
  }
}

if (isEnabled(api)) {
  safe(() => {
    registerDevToolsShortcut();
    scheduleMainMenuBoot(api);
    modGlobal.registerProbe();
    registerUi();
    api.ui.toast("Example Mod probe registered — select it on the Retro Console");
  });
}

console.log(`[${MOD_ID}] loaded — use window.api in DevTools`);

// Keep React referenced so esbuild jsx transform can resolve the factory if needed.
void React;
