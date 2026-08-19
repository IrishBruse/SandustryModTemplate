import { defineMod } from "./lib/modinfo";

export const modManifest = defineMod({
  manifestVersion: 1,
  id: "author.example-mod",
  name: "Example Mod",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description: "Embeds Example Mod inside Sandustry.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn the mod off without unsubscribing.",
    },
    debug: {
      type: "boolean",
      default: true,
      labelKey: "Debug",
      descriptionKey: "DevTools, splash skip, and main-menu auto-boot. Dev builds only.",
    },
  },
});
