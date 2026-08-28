import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.collectable-element";
const ELEMENT_ID = `${MOD_ID}:platinum`;
const game = await setupGame();

test("collectable-element Platinum has collector value 2", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const value = await game.evaluate((id: string) => {
    try {
      const type = sandkit.api.elements.getTypeById(id);
      if (typeof type !== "number" || !Number.isFinite(type)) return null;
      return sandkit.api.collector.getValueByType(type);
    } catch {
      return null;
    }
  }, ELEMENT_ID);
  assert.equal(value, 2);
});
