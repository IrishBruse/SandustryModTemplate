import { installDebug, isHotReloadEval, onDispose } from "./debug";
import { registerManagementMenuButton } from "@modkit/ui";
import { isEnabled, safe } from "@modkit/utils";
import { installGlobals, MOD_ID } from "./globals";
import { Overlay, gifUi } from "./ui/Overlay";
import tailwindCss from "./ui/tailwind.css";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installDebug(api, MOD_ID);

const OVERLAY_ID = "gif-recorder-example";

const GIF_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm80-80h480v-320L160-240v80Zm0-160 160-80-160-80v160Z"/></svg>`;

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

  const stop = registerManagementMenuButton({
    id: `${MOD_ID}:gif`,
    icon: GIF_ICON,
    label: "GIF Record",
    hotkey: "F7",
    onClick: () => {
      gifUi.toggle();
    },
  });
  onDispose(stop);
}

if (isEnabled(api)) {
  safe(() => {
    installTailwind();
    registerUi();
  });
} else {
  console.warn(`[${MOD_ID}] mod disabled in settings — UI not registered`);
}

console.log(
  `[${MOD_ID}] ${reloaded ? "reloaded" : "loaded"} — F7 opens GIF recorder; C then Record`,
);
