import { inGame, isEnabled } from "@modkit/utils";
import { startCartDraw } from "./draw.ts";
import { registerContent, unlockContent } from "./register.ts";
import { loadCarts, startCartLoop } from "./runtime.ts";

const api = sandkit.api;

function boot(): void {
  if (!isEnabled(api)) return;
  loadCarts();
  unlockContent();
  startCartLoop();
  startCartDraw();
}

registerContent();

api.events.on("game:ready", () => {
  boot();
  api.ui.toast("Minecarts ready — click a rail with the Minecart tool to place a cart", {});
});

if (inGame()) boot();

console.log("loaded");
