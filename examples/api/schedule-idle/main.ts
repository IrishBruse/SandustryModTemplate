const api = sandkit.api;

api.schedule.nextTick(() => {
  api.grid.mutate((_writer) => {
    api.ui.toast("Schedule Idle — grid.mutate callback ran", {});
    console.log("grid.mutate fired");
  });
});

console.log("loaded — schedule.nextTick + grid.mutate");
