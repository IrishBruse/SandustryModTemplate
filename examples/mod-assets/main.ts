import { onDispose } from "@modkit/debug";
import { modinfo } from "./mod";
import { ModAssetsOverlay } from "./ui/Overlay";
import tailwindCss from "@modkit/ui/tailwind.css";

const api = sandkit.api;
const OVERLAY_ID = "mod-assets";
const BADGE_URL = api.assets.getUrl("badge.png");

function installTailwind() {
  const id = `${modinfo.id}-tailwind`;
  document.getElementById(id)?.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = tailwindCss;
  document.head.appendChild(style);
  onDispose(() => style.remove());
}

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, ModAssetsOverlay);
  if (!dispose) {
    console.warn("UI panel registration failed");
    return;
  }
  onDispose(dispose);
}

installTailwind();
registerUi();

console.log(`${reloaded ? "reloaded" : "loaded"} — badge at ${BADGE_URL}`);
