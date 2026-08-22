import { safe } from "@modkit/utils";

const api = sandkit.api;

safe(() => {
  if (!reloaded) api.ui.toast("Hello World Example loaded", {});
});

console.log(`${reloaded ? "reloaded" : "loaded"} — use api in DevTools`);
