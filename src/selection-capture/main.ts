import { installHotReload, isHotReloadEval, onDispose } from "./debug";
import { isEnabled, safe } from "@modkit/utils";
import { installGlobals, MOD_ID } from "./globals";
import { Overlay } from "./ui/Overlay";
import tailwindCss from "./ui/tailwind.css";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installHotReload(api, MOD_ID);

const OVERLAY_ID = "selection-capture";

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
} else {
  console.warn(`[${MOD_ID}] mod disabled in settings — UI not registered`);
}

console.log(`[${MOD_ID}] ${reloaded ? "reloaded" : "loaded"} — C then F7 (PNG or GIF)`);
