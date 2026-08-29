import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "irishbruse.minecart",
  name: "Minecarts",
  version: "0.1.3",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description: "Rails, ramps, loaders, and unloaders move bulk cargo without long conveyor runs.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn minecart rails and carts off.",
    },
  },
});
