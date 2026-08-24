import { onDispose } from "@modkit/debug";
import { isEnabled } from "@modkit/utils";
import { installInstantPickBlock } from "./src/pick-block";

const api = sandkit.api;

/** Register after built-in shortcuts mod binds vanilla Picker (misc onInit). */
function boot() {
  if (!isEnabled(api)) return;
  installInstantPickBlock();
}

for (const stop of [
  api.events.on("mods:initialized", boot),
  api.events.on("game:ready", boot),
  api.events.on("scene:started:game", boot),
]) {
  onDispose(stop);
}

const state = sandkit.state as { sandkit?: { gameReady?: boolean } };
if (reloaded || state.sandkit?.gameReady || api.scene.getActive() === sandkit.enums.Scene.Game) {
  boot();
}

console.log(`${reloaded ? "reloaded" : "loaded"} — Picker picks instantly (default F)`);
