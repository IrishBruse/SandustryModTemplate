import { defineModInfo, definePatches } from "@modkit/modinfo";

/** Re-add the vanilla Options → Debug tab (content ships in bundle; tab button was omitted). */
export const patches = definePatches([
  {
    id: "options-debug-tab",
    file: "js/bundle.js",
    find: 'F.length>0&&P.push("mods");const O=',
    operation: "replace",
    code: 'F.length>0&&P.push("mods");P.push("debug");const O=',
    expectedMatches: 1,
  },
]);

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.debug",
  name: "debug",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description:
    "Dev companion: DevTools, splash skip, main-menu auto-boot, disable autosave, Options Debug tab, and F3 Debug panel. Installed on debug builds only.",
  dependencies: [],
  loadOrder: -100,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn all debug helpers off without removing the mod.",
    },
    openDevTools: {
      type: "boolean",
      default: false,
      labelKey: "Open DevTools on load",
      descriptionKey:
        "Open Electron DevTools when the mod loads. Keep off while using F5 so the IDE debugger stays attached.",
    },
    f12DevTools: {
      type: "boolean",
      default: true,
      labelKey: "F12 opens DevTools",
      descriptionKey: "F12 opens Electron DevTools. That can disconnect an IDE debugger session.",
    },
    skipSplash: {
      type: "boolean",
      default: false,
      labelKey: "Skip splash",
      descriptionKey: "Click through the startup splash while logos are visible.",
    },
    autoBoot: {
      type: "boolean",
      default: false,
      labelKey: "Auto-boot Continue",
      descriptionKey: "Click Continue on the main menu after it has been visible.",
    },
    engineDebug: {
      type: "boolean",
      default: true,
      labelKey: "Debug panel (F3)",
      descriptionKey:
        "Turns engine debug.active on so vanilla Debug / Stats appear. Also under Options → Debug. F3 toggles the companion panel (top left).",
    },
    disableAutosave: {
      type: "boolean",
      default: true,
      labelKey: "Disable autosave",
      descriptionKey:
        "Set the session autosave interval to 0. Manual saves still work. Turn off to test autosave.",
    },
  },
});
