import { modinfo } from "./modinfo";

const api = sandkit.api;

api.hooks.intercept("input:escape", (_args, context) => {
  api.ui.toast("Hooks Intercept — escape blocked", {});
  context.cancel();
});

api.ui.toast("Hooks Intercept — Escape no longer opens the pause menu", {});

console.log(`loaded — hooks.intercept(input:escape) for ${modinfo.id}`);
