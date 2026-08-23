import { onDispose } from "@modkit/debug";
import { modinfo } from "./mod";
import { BINDINGS, InputBindingOverlay } from "./ui/Overlay";
import tailwindCss from "@modkit/ui/tailwind.css";

const api = sandkit.api;
const OVERLAY_ID = "input-binding-example";

function installTailwind() {
  const id = `${modinfo.id}-tailwind`;
  document.getElementById(id)?.remove();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = tailwindCss;
  document.head.appendChild(style);
  onDispose(() => style.remove());
}

function installBindings() {
  api.input.registerBinding(BINDINGS.toast, ["KeyT"], {
    displayName: "Show toast",
    category: modinfo.name,
    handlers: {
      down: () => {
        api.ui.toast("Input binding fired", {});
      },
    },
  });

  api.input.registerBinding(BINDINGS.togglePanel, ["KeyO"], {
    displayName: "Toggle panel",
    category: modinfo.name,
    handlers: {
      down: () => {
        window.dispatchEvent(new CustomEvent(`${modinfo.id}:toggle-panel`));
      },
    },
  });
}

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, InputBindingOverlay);
  if (!dispose) {
    console.warn("UI panel registration failed");
    return;
  }
  onDispose(dispose);
}

installTailwind();
installBindings();
registerUi();

console.log(`${reloaded ? "reloaded" : "loaded"} — rebind keys under Options → Controls`);
