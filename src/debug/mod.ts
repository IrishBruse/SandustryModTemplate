import { defineModInfo, definePatches } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.debug",
  name: "debug",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description:
    "Dev companion: DevTools, splash skip, main-menu auto-boot, and F3 engine Debug. Installed on debug builds only.",
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
      default: true,
      labelKey: "Open DevTools on load",
      descriptionKey:
        "Open Electron DevTools when the mod loads. Skipped when the IDE debugger is attached (F5).",
    },
    f12DevTools: {
      type: "boolean",
      default: true,
      labelKey: "F12 opens DevTools",
      descriptionKey: "F12 opens Electron DevTools. That can disconnect an IDE debugger session.",
    },
    skipSplash: {
      type: "boolean",
      default: true,
      labelKey: "Skip splash",
      descriptionKey:
        "Click through the startup splash while logos are visible. The bundle patch still runs while this mod is installed.",
    },
    autoBoot: {
      type: "boolean",
      default: true,
      labelKey: "Auto-boot Continue",
      descriptionKey: "Click Continue on the main menu after it has been visible.",
    },
    engineDebug: {
      type: "boolean",
      default: true,
      labelKey: "Engine Debug (F3)",
      descriptionKey:
        "Management Debug row and F3 open the engine Debug window. Turns engine debug.active on and hides the vanilla Debug / Stats buttons.",
    },
  },
});

/** Splash skip — this mod is debug-build only, so these always write to patches.json. */
export const patches = definePatches([
  {
    id: "skip-startup-splash",
    file: "js/bundle.js",
    find: 'document.addEventListener("keydown",p),document.addEventListener("click",h);',
    operation: "replace",
    expectedMatches: 1,
    code: `document.addEventListener("keydown", p), document.addEventListener("click", h), (function(){
  var n=0;
  requestAnimationFrame(function _skipStartupSplash() {
    document.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    n++;
    if (!sessionStorage.getItem("splashShown") && n<90) requestAnimationFrame(_skipStartupSplash);
  });
})();`,
  },
]);
