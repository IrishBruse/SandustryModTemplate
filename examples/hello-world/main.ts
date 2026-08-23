const api = sandkit.api;

if (!reloaded) api.ui.toast("Hello World loaded", {});

console.log(`${reloaded ? "reloaded" : "loaded"} — use api in DevTools`);
