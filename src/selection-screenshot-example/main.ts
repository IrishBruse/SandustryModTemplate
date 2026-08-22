import { installDebug, isHotReloadEval, onDispose } from "./debug";
import { isEnabled, safe } from "@modkit/utils";
import { installGlobals, MOD_ID } from "./globals";
import { captureSelectionPng } from "./captureSelection";
import { getSelectionCellBounds, peekMarqueeCustomData } from "./selectionBounds";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installDebug(api, MOD_ID);

const BINDING_ID = `${MOD_ID}:screenshot-selection`;
const DEFAULT_KEYS = ["F8"];
const LOG = `[${MOD_ID}]`;

/** Survives hot reload so registerBinding always calls the latest capture. */
type ShotGlobal = { run: () => void };
const shotGlobal = ((globalThis as unknown as { __selectionScreenshot?: ShotGlobal })
  .__selectionScreenshot ??= { run: () => undefined });

let captureInFlight = false;

function toast(message: string): void {
  api.ui.toast(message, {});
}

async function screenshotSelection(): Promise<void> {
  console.log(`${LOG} F8 fired (handler build: mapData-raster)`);
  if (captureInFlight) {
    console.log(`${LOG} skipped — capture already in flight`);
    return;
  }

  const peek = peekMarqueeCustomData();
  console.log(`${LOG} marquee customData:`, peek);

  const bounds = getSelectionCellBounds();
  if (!bounds) {
    console.warn(`${LOG} no selection bounds`);
    toast("No marquee selection — press C, drag, then F8");
    return;
  }

  console.log(`${LOG} selection cell bounds:`, bounds);
  captureInFlight = true;
  try {
    const result = await captureSelectionPng(api, bounds);
    console.log(`${LOG} capture result:`, result);
    switch (result) {
      case "ok":
        toast("Selection screenshot saved");
        break;
      case "no-canvas":
        toast("Could not find map data");
        break;
      case "out-of-view":
        toast("Selection is off-screen — pan the camera and try again");
        break;
      case "blank":
        toast("Screenshot was blank — mapData had no cells");
        break;
      default:
        toast("Selection screenshot failed");
        break;
    }
  } catch (error) {
    console.error(`${LOG} capture threw:`, error);
    toast("Selection screenshot failed");
  } finally {
    captureInFlight = false;
  }
}

shotGlobal.run = () => {
  void screenshotSelection();
};

function registerHotkey(): void {
  // Capture-phase listener — removed on dispose so hot reload cannot stack stale handlers.
  function onKeyDown(event: KeyboardEvent) {
    if (event.code !== "F8" || event.repeat) return;
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    event.preventDefault();
    event.stopPropagation();
    shotGlobal.run();
  }
  window.addEventListener("keydown", onKeyDown, true);
  onDispose(() => window.removeEventListener("keydown", onKeyDown, true));

  // Also register in Settings when possible (indirection keeps handler fresh).
  console.log(`${LOG} registering binding ${BINDING_ID} → ${DEFAULT_KEYS.join("+")}`);
  api.input.registerBinding(BINDING_ID, DEFAULT_KEYS, {
    displayName: "Screenshot selection",
    category: "editing",
    handlers: {
      down: () => {
        shotGlobal.run();
      },
    },
  });
}

if (isEnabled(api)) {
  safe(() => {
    registerHotkey();
  });
} else {
  console.warn(`${LOG} mod disabled in settings — hotkey not registered`);
}

console.log(
  `${LOG} ${reloaded ? "reloaded" : "loaded"} — select with C, then F8 (mapData raster)`,
);
