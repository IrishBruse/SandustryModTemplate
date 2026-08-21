import { installDebug, isHotReloadEval, onDispose } from "./debug";
import { sandkit } from "@modkit/sandkit";
import { isEnabled, safe } from "@modkit/utils";
import { installGlobals, MOD_ID } from "./globals";
import { Overlay } from "./ui/Overlay";
import tailwindCss from "./ui/tailwind.css";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installDebug(api, MOD_ID);

const OVERLAY_ID = "overlay-hotkey";

/** Sandkit loads `main.js` only. Insert the compiled utilities into the document. */
function installTailwind() {
  const id = `${MOD_ID}-tailwind`;
  document.getElementById(id)?.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = tailwindCss;
  document.head.appendChild(style);
  onDispose(() => style.remove());
}

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, Overlay);
  if (!dispose) {
    console.warn(`[${MOD_ID}] UI panel registration failed`);
    return;
  }
  onDispose(dispose);
}

if (isEnabled(api)) {
  safe(() => {
    installTailwind();
    registerUi();
  });
}

console.log(`[${MOD_ID}] ${reloaded ? "reloaded" : "loaded"} — Alt+E toggles the overlay`);
