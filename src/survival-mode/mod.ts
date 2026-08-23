import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "irishbruse.survival-mode",
  name: "Survival Mode",
  version: "0.1.0",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description:
    "Survival rules: health HUD, jump and run, stronger gravity, and step-up climbing.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn survival rules off without unsubscribing.",
    },
    maxStepCells: {
      type: "number",
      default: 3,
      min: 1,
      max: 8,
      step: 1,
      labelKey: "Max step cells",
      descriptionKey: "How many cells the player can step up when walking (1–8). Default 3.",
    },
  },
});
