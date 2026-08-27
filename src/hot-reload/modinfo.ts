import { defineModInfo } from "@modkit/modinfo";
import {
  AUTO_LOAD_FROM_STORAGE,
  AUTO_LOAD_LAST_PLAYED,
  COMPANION_MOD_ID,
} from "./boot/auto-load-save";

export { debugPatches } from "./patches.ts";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: COMPANION_MOD_ID,
  name: "Hot Reload Dev Tools",
  version: "0.0.2",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description:
    "Dev companion: watch local mods, DevTools, auto-load save, disable autosave, F3 overlay. Debug builds install it; release stages build/hot-reload/.",
  dependencies: [],
  loadOrder: -1000,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Disable helpers without removing the mod.",
    },
    // Save auto loading
    autoLoad: {
      type: "boolean",
      default: false,
      labelKey: "Auto-load save",
      descriptionKey: "Skip splash and main menu. Loads the save below.",
    },
    startSave: {
      type: "choice",
      default: AUTO_LOAD_FROM_STORAGE,
      labelKey: "Start save",
      descriptionKey:
        "Last played, or mod storage (set with api.storage from another mod). Empty storage uses last played.",
      options: [
        { value: AUTO_LOAD_LAST_PLAYED, labelKey: "Last played" },
        { value: AUTO_LOAD_FROM_STORAGE, labelKey: "Mod storage" },
      ],
    },
    disableAutosave: {
      type: "boolean",
      default: false,
      labelKey: "Disable autosave",
      descriptionKey: "Stop session autosave. Manual saves still work.",
    },
    watchLocalMods: {
      type: "boolean",
      default: false,
      labelKey: "Watch local mods",
      descriptionKey: "Re-eval other mods' main.js when the file changes. Not workers or patches.",
    },
    fastBoot: {
      type: "boolean",
      default: false,
      labelKey: "Fast dev boot",
      descriptionKey:
        "Skip foliage generate on boot (dev). Raster and shaders stay vanilla. Restart once after you turn it on.",
    },
    // Dev tools
    openDevTools: {
      type: "boolean",
      default: false,
      labelKey: "Open DevTools on load",
      descriptionKey: "Open DevTools when the mod loads.",
    },
    f12DevTools: {
      type: "boolean",
      default: false,
      labelKey: "F12 opens DevTools",
      descriptionKey: "F12 opens DevTools.",
    },
    // F3 Menu
    f3Debug: {
      type: "boolean",
      default: false,
      labelKey: "F3 debug overlay",
      descriptionKey: "F3 toggles the debug overlay.",
    },
  },
});
