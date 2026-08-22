import { onDispose } from "@modkit/debug";
import { isEnabled, safe } from "@modkit/utils";
import { modinfo } from "./mod";
import { Overlay } from "./ui/Overlay";
import tailwindCss from "@modkit/ui/tailwind.css";

const api = sandkit.api;
const OVERLAY_ID = "selection-capture";

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
  const dispose = api.ui.inject(OVERLAY_ID, Overlay);
  if (!dispose) {
    console.warn("UI panel registration failed");
    return;
  }
  onDispose(dispose);
}

if (isEnabled(api)) {
  safe(() => {
    installTailwind();
    registerUi();
  });
} else {
  console.warn("mod disabled in settings — UI not registered");
}

console.log(`${reloaded ? "reloaded" : "loaded"} — C then F7 (PNG or GIF)`);
