import { isEnabled } from "@modkit/utils";
import { registerElements } from "./elements/register.ts";
import { registerHarvest } from "./terrains/harvest.ts";
import { registerTerrains } from "./terrains/register.ts";

const api = sandkit.api;

if (isEnabled(api)) {
  registerElements();
  const pineWoodType = registerTerrains();
  registerHarvest(pineWoodType);
  api.events.on("game:ready", () => {
    api.ui.toast("Trees — Debug → Element → Pine Seed", {});
  });
}

console.log("loaded");
