import { defineModInfo, definePatches } from "@modkit/modinfo";
import { modkitDebugPatches } from "@modkit/patches";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.example-mod",
  name: "Example Mod",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "A Sandustry mod built from the TypeScript template.",
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

/** Production patches — always written to `patches.json`. */
export const patches = definePatches([]);

/** Debug-only patches — included in dev / `--debug` builds only. */
export const debugPatches = definePatches([...modkitDebugPatches]);
