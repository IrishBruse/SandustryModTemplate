import { defineModInfo } from "@modkit/modinfo";

export { patches } from "./patches";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "example.collector-element",
  name: "Collector Element",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "Platinum collectable element plus Collector money-check patches.",
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
