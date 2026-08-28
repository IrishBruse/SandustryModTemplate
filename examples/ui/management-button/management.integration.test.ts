import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.management-button";
const ROW_ID = `${MOD_ID}:example`;
const game = await setupGame();

test("management-button row is in the column", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const found = await game.evaluate((rowId: string) => {
    return Boolean(document.querySelector(`[data-modkit-management-row="${rowId}"]`));
  }, ROW_ID);
  assert.equal(found, true);
});
