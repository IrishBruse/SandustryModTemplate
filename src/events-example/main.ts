import { onDispose } from "@modkit/debug";
import { modinfo } from "./mod";

const api = sandkit.api;

const LOG_EVERY_MS = 5000;
let frameCount = 0;
let lastLogAt = performance.now();

const stopReady = api.events.on("game:ready", () => {
  if (!reloaded) api.ui.toast("Events Example — game ready", {});
  console.log("game:ready");
});

const stopFrames = api.events.on("frame:render", () => {
  frameCount += 1;
  const now = performance.now();
  if (now - lastLogAt < LOG_EVERY_MS) return;
  console.log(`frame:render — ${frameCount} frames in the last ${LOG_EVERY_MS / 1000}s`);
  frameCount = 0;
  lastLogAt = now;
});

onDispose(() => {
  stopReady();
  stopFrames();
});

console.log(`${reloaded ? "reloaded" : "loaded"} — listening for game:ready and frame:render`);
