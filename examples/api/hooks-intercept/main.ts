import { modinfo } from "./modinfo";

const api = sandkit.api;

api.hooks.intercept("input:escape", () => {
  console.log(`hooks.intercept(input:escape) for ${modinfo.id}`);
});

api.ui.toast("Hooks Intercept — input:escape hook registered", {});

console.log(`loaded — hooks.intercept(input:escape) for ${modinfo.id}`);
