const api = sandkit.api;

api.events.on("game:ready", () => {
  api.ui.toast("Events — game ready", {});
  console.log("game:ready");
});

console.log("loaded — listening for game:ready");
