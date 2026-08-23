const api = sandkit.api;

if (!reloaded) {
  api.ui.toast("Worker API Example loaded — check worker console for probe", {});
}

console.log(`main ${reloaded ? "reloaded" : "loaded"} — workerEntry probes WorkerSandkitApi`);
