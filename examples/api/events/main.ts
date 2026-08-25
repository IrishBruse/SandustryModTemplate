const api = sandkit.api;

const LOG_EVERY_MS = 5000;
let frameCount = 0;
let lastLogAt = performance.now();

api.events.on("game:ready", () => {
  api.ui.toast("Events — game ready", {});
  console.log("game:ready");
});

api.events.on("frame:render", () => {
  frameCount += 1;
  const now = performance.now();
  if (now - lastLogAt < LOG_EVERY_MS) return;
  console.log(`frame:render — ${frameCount} frames in the last ${LOG_EVERY_MS / 1000}s`);
  frameCount = 0;
  lastLogAt = now;
});

console.log("loaded — listening for game:ready and frame:render");
