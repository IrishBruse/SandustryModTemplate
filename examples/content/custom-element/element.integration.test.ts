import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.custom-element";
const ELEMENT_ID = `${MOD_ID}:spark-dust`;
const game = await setupGame();

test("custom-element Spark Dust is registered", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const type = await game.evaluate((id: string) => {
    try {
      const value = sandkit.api.elements.getTypeById(id);
      return typeof value === "number" && Number.isFinite(value) ? value : null;
    } catch {
      return null;
    }
  }, ELEMENT_ID);
  assert.equal(typeof type, "number");
});
