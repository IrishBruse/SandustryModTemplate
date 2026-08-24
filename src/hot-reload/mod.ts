import { defineModInfo } from "@modkit/modinfo";
import { AUTO_LOAD_FROM_STORAGE, AUTO_LOAD_LAST_PLAYED } from "./boot/auto-load-save";

export { patches } from "./patches";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "hot-reload",
  name: "Hot Reload Dev Tools",
  version: "0.0.2",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description:
    "Dev companion: DevTools, auto-load save, disable autosave, local-mod hot reload. Installed on debug builds only.",
  dependencies: [],
  loadOrder: -2147483648,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Disable helpers without removing the mod.",
    },
    // Hot reloading
    watchLocalMods: {
      type: "boolean",
      default: false,
      labelKey: "Watch local mods",
      descriptionKey: "Reload local mods when files change. Skips Workshop.",
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
