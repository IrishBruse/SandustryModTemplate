import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "example.hooks-intercept",
  name: "Hooks Intercept",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "Cancel the pause-menu escape key with hooks.intercept.",
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
