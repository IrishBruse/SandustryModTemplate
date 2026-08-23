import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.custom-element-example",
  name: "Custom Element",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "Register a powder element and paint it at the mouse cell.",
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
