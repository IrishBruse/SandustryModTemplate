import { installDebug, isHotReloadEval, onDispose } from "./debug";
import { isEnabled, registerRetroGame, safe } from "@framework/sdk";
import { installGlobals, MOD_ID } from "./globals";
import { ExampleOverlay } from "./ui/ExampleOverlay";

const api = sandkit.api;
const reloaded = isHotReloadEval(MOD_ID);
installGlobals(api);
installDebug(api, MOD_ID);

const OVERLAY_ID = "example-overlay";

const WIDTH = 32;
const HEIGHT = 24;

function registerUi() {
  const dispose = api.ui.inject(OVERLAY_ID, ExampleOverlay);
  if (!dispose) {
    console.warn(`[${MOD_ID}] UI panel registration failed`);
    return;
  }
  onDispose(dispose);
}

function registerNoiseTest() {
  const registered = registerRetroGame({
    id: "example",
    name: "Example Mod",
    options: { width: WIDTH, height: HEIGHT },
    init(display) {
      display.clearScreen(true);
      return { tick: 0 };
    },
    update(display, state) {
      const tick = state.tick + 1;
      display.clearScreen(Math.floor(tick / 10) % 2 === 0);
      return { tick };
    },
    handleInput(_display, state) {
      return state;
    },
  });
  if (registered) console.log(`[${MOD_ID}] Example Mod registered at ${WIDTH}x${HEIGHT}`);
}

if (isEnabled(api)) {
  safe(() => {
    registerUi();
    registerNoiseTest();
    if (!reloaded) api.ui.toast("Example mod loaded", {});
  });
}

console.log(`[${MOD_ID}] ${reloaded ? "reloaded" : "loaded"} — use api in DevTools`);
