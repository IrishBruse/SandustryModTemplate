import { defineModInfo, definePatches } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "irishbruse.selection-capture",
  name: "Selection Capture",
  version: "0.1.0",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description: "C-cursor marquee: F7 opens the panel to copy a PNG or record a GIF.",
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
