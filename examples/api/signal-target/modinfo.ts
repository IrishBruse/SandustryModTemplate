import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "example.signal-target",
  name: "Signal Target",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "Wire signal inputs to vanilla heat cannons.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn the mod off without unsubscribing.",
    },
  },
});
