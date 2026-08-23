import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.mod-assets-example",
  name: "Mod Assets",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "Ship static files under mod/ and load them with assets.getUrl.",
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
