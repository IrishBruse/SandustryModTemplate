import { defineModInfo } from "@modkit/modinfo";
import { AUTO_LOAD_FROM_STORAGE, AUTO_LOAD_LAST_PLAYED } from "./boot/auto-load-save";

export { patches } from "./patches";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "irishbruse.debug",
  name: "debug",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description:
    "Dev companion: DevTools, auto-load save, disable autosave, local-mod hot reload. Installed on debug builds only.",
  dependencies: [],
  loadOrder: -1000,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Disable helpers without removing the mod.",
    },
    openDevTools: {
      type: "boolean",
      default: false,
      labelKey: "Open DevTools on load",
      descriptionKey: "Open DevTools when the mod loads.",
    },
    f12DevTools: {
      type: "boolean",
      default: true,
      labelKey: "F12 opens DevTools",
      descriptionKey: "F12 opens DevTools.",
    },
    autoLoad: {
      type: "boolean",
      default: true,
      labelKey: "Auto-load save",
      descriptionKey: "Skip splash and main menu. Loads the save below.",
    },
    startSave: {
      type: "choice",
      default: AUTO_LOAD_FROM_STORAGE,
      labelKey: "Start save",
      descriptionKey:
        "Last played, or mod storage (Start save panel / another mod). Empty storage uses last played.",
      options: [
        { value: AUTO_LOAD_LAST_PLAYED, labelKey: "Last played" },
        { value: AUTO_LOAD_FROM_STORAGE, labelKey: "Mod storage" },
      ],
    },
    engineDebug: {
      type: "boolean",
      default: true,
      labelKey: "Engine debug",
      descriptionKey: "Show vanilla Debug / Stats. F3 toggles the overlay.",
    },
    disableAutosave: {
      type: "boolean",
      default: true,
      labelKey: "Disable autosave",
      descriptionKey: "Stop session autosave. Manual saves still work.",
    },
    watchLocalMods: {
      type: "boolean",
      default: true,
      labelKey: "Watch local mods",
      descriptionKey: "Reload local mods when files change. Skips Workshop.",
    },
    hotReloadFallback: {
      type: "choice",
      default: "toast",
      labelKey: "If hot reload cannot run",
      descriptionKey: "If a mod cannot hot-reload: do nothing, toast, or reload the page.",
      options: [
        { value: "off", labelKey: "Do nothing" },
        { value: "toast", labelKey: "Toast" },
        { value: "reload", labelKey: "Reload page" },
      ],
    },
  },
});
