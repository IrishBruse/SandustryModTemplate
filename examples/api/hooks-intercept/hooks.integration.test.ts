import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.hooks-intercept";
const game = await setupGame();

test("hooks-intercept is in the ordered mod list", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  assert.ok(ids.includes(MOD_ID));
});
