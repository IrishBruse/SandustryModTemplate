import { onDispose } from "@modkit/debug";
import { isEnabled, safe } from "@modkit/utils";
import { MOD_ID } from "./mod";
import { Overlay } from "./ui/Overlay";
import tailwindCss from "@modkit/ui/tailwind.css";

const api = sandkit.api;
const OVERLAY_ID = "overlay-hotkey-example";

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
