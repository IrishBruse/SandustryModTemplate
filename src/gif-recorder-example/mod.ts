import { defineModInfo, definePatches } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.gif-recorder-example",
  name: "GIF Recorder Example",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "Copy a C-cursor marquee, then record an animated GIF of that area (F7).",
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
