const api = sandkit.api;

api.schedule.nextTick(() => {
  api.world.runWhenSimulationIdle(() => {
    api.ui.toast("Schedule Idle — simulation idle callback ran", {});
    console.log("runWhenSimulationIdle fired");
  });
});

console.log("loaded — schedule.nextTick + world.runWhenSimulationIdle");
