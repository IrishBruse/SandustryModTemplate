import { onDispose } from "@modkit/debug";
import { isEnabled } from "@modkit/utils";
import { modinfo } from "./mod";
import { installDebugHealBinding, loadHealth } from "./health/health";
import { installHazardHooks } from "./hazards/hazards";
import {
  applySurvivalMovementRules,
  installMovementHooks,
  JUMP_VELOCITY,
} from "./movement/movement";
import { HealthHud } from "./ui/HealthHud";

const api = sandkit.api;
const OVERLAY_ID = "survival-mode-health";

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, HealthHud);
  if (!dispose) {
    console.warn("Survival Mode: health HUD registration failed");
  }
}

let booted = false;

function boot() {
  if (!isEnabled(api)) return;
  if (booted) return;
  booted = true;

  api.storage.ensure(modinfo.id);
  loadHealth();
  installDebugHealBinding();
  applySurvivalMovementRules();
  registerUi();
  onDispose(installMovementHooks());
  onDispose(installHazardHooks());
}

api.events.on("game:ready", boot);

console.log(`${reloaded ? "reloaded" : "loaded"} — jump velocity ${JUMP_VELOCITY}`);
