import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "example.element-reaction",
  name: "Element Reaction",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "Register one element contact reaction.",
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
