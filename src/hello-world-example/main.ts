import { isEnabled, safe } from "@modkit/utils";
import { MOD_ID } from "./mod";

const api = sandkit.api;
if (isEnabled(api)) {
  safe(() => {
    if (!reloaded) api.ui.toast("Hello World Example loaded", {});
  });
}

console.log(`[${MOD_ID}] ${reloaded ? "reloaded" : "loaded"} — use api in DevTools`);
