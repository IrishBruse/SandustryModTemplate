import { isEnabled, safe } from "@modkit/utils";
import { MOD_ID } from "./mod";

const api = sandkit.api;
if (isEnabled(api)) {
  safe(() => {
    if (!reloaded) {
      api.ui.toast("Worker API Example loaded — check worker console for probe", {});
    }
  });
}

console.log(
  `[${MOD_ID}] main ${reloaded ? "reloaded" : "loaded"} — workerEntry probes WorkerSandkitApi`,
);
