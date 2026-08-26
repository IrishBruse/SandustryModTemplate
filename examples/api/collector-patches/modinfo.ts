import { defineModInfo } from "@modkit/modinfo";

export { patches } from "./patches";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "example.collector-patches",
  name: "Collector Patches",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "Patch Collector admission to allow any element with collectable value.",
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
