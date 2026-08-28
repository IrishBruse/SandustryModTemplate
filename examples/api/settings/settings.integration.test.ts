import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.settings";
const game = await setupGame();

test("settings example is loaded", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const bag = await game.evaluate(() => {
    const all = sandkit.api.settings.getAll();
    return all && typeof all === "object";
  });
  assert.equal(bag, true);
});
