import { safe } from "@modkit/utils";
import { modinfo } from "./mod";
import { Overlay } from "./ui/Overlay";
import tailwindCss from "@modkit/ui/tailwind.css";

const api = sandkit.api;
const OVERLAY_ID = "selection-capture";

function installStyles() {
  const id = `${modinfo.id}-styles`;
  document.getElementById(id)?.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = tailwindCss;
  document.head.appendChild(style);
}

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, Overlay);
  if (!dispose) {
    console.warn("UI panel registration failed");
  }
}

safe(() => {
  installStyles();
  registerUi();
});

console.log(`${reloaded ? "reloaded" : "loaded"} — C then F7 (PNG or GIF)`);
