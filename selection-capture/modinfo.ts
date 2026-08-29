import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "irishbruse.selection-capture",
  name: "Screenshot and GIF recorder",
  version: "0.6.0",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description:
    "Pixel-perfect PNG and GIF of your C selection. Press C, drag a box, then F7. Screenshot copies or downloads a PNG. Record GIF captures sim ticks. Options → Mods: countdown, upscale, and download PNG.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn the mod off without unsubscribing.",
    },
    countdownSeconds: {
      type: "number",
      default: 3,
      min: 0,
      max: 10,
      step: 1,
      labelKey: "GIF countdown",
      descriptionKey: "Seconds to wait before Record GIF starts. 0 starts at once.",
    },
    downloadPng: {
      type: "boolean",
      default: false,
      labelKey: "Download PNG",
      descriptionKey: "Save a PNG file instead of copying to the clipboard.",
    },
    pngScale: {
      type: "number",
      default: 1,
      min: 1,
      max: 8,
      step: 1,
      labelKey: "PNG upscale",
      descriptionKey: "Nearest-neighbor upscale after capture. 1 keeps native crop pixels.",
    },
    gifScale: {
      type: "number",
      default: 1,
      min: 1,
      max: 8,
      step: 1,
      labelKey: "GIF upscale",
      descriptionKey: "Nearest-neighbor upscale after capture. 1 keeps native crop pixels.",
    },
  },
});
