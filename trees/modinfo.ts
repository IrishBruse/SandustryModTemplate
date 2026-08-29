import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "irishbruse.trees",
  name: "Trees",
  version: "0.1.7",
  apiVersion: 1,
  gameVersion: { minimum: "0.5.5" },
  entry: "main.js",
  workerEntry: "worker.js",
  author: "IrishBruse",
  description:
    "Pine trees grow on wet sand. Mine the trunk to harvest wood. Seal burning wood to make charcoal.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn pine trees, wood, and charcoal off.",
    },
  },
});
