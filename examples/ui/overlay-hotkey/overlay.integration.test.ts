import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.overlay-hotkey";
const STYLE_ID = `${MOD_ID}-tailwind`;
const game = await setupGame();

test("overlay-hotkey injects Tailwind CSS", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const style = await game.evaluate((id: string) => Boolean(document.getElementById(id)), STYLE_ID);
  assert.equal(style, true);
});
