const api = sandkit.api;

api.ui.toast("Worker API loaded — check worker console for probe", {});

console.log(`main ${reloaded ? "reloaded" : "loaded"} — workerEntry probes WorkerSandkitApi`);
