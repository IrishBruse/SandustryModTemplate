import { onDispose } from "@modkit/debug";
import { isEnabled } from "@modkit/utils";
import { modinfo } from "./mod";
import { loadHealth } from "./health";
import { applySurvivalMovementRules, installMovementHooks } from "./movement";
import { HealthHud } from "./ui/HealthHud";

const api = sandkit.api;
const OVERLAY_ID = "survival-mode-health";

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, HealthHud);
  if (!dispose) {
    console.warn("Survival Mode: health HUD registration failed");
    return;
  }
  onDispose(dispose);
}

let booted = false;

function boot() {
  if (booted || !isEnabled(api)) return;
  booted = true;

  api.storage.ensure(modinfo.id);
  loadHealth();
  applySurvivalMovementRules();
  registerUi();
  onDispose(installMovementHooks());
}

const stopReady = api.events.on("game:ready", boot);
onDispose(stopReady);

if (api.scene.getActive() === sandkit.enums.Scene.Game) {
  boot();
}

console.log(`${reloaded ? "reloaded" : "loaded"} — survival rules active when enabled`);
