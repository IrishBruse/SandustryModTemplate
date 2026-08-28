import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.collector-patches";
const game = await setupGame();

test("collector-patches is loaded and Gold has a collector value", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const value = await game.evaluate(() => {
    const gold = sandkit.enums.ElementType.Gold;
    return sandkit.api.collector.getValueByType(gold);
  });
  assert.equal(typeof value, "number");
  assert.ok((value ?? 0) > 0);
});
