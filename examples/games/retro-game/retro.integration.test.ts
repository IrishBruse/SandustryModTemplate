import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.retro-game";
const game = await setupGame();

test("retro-game is loaded and retroConsole.registerGame exists", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const canRegister = await game.evaluate(() => {
    const retroConsole = sandkit.engine.api.retroConsole;
    return typeof retroConsole?.registerGame === "function";
  });
  assert.equal(canRegister, true);
});
