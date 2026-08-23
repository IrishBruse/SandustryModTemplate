import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "irishbruse.selection-capture",
  name: "Screenshot and GIF recorder",
  version: "0.4.1",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description:
    "Pixel-perfect PNG and GIF of your C selection. Press C, drag a box, then F7. Screenshot copies a PNG to the clipboard. Record GIF captures sim ticks. Optional greenscreen for chroma key.",
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
