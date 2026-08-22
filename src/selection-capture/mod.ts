import { defineModInfo, definePatches } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.selection-capture",
  name: "Selection Capture",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "C-cursor marquee: F8 copies a PNG. F7 records a GIF of that area.",
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

/** Production patches — always written to `patches.json`. */
export const patches = definePatches([]);
