import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.custom-terrain";
const TERRAIN_ID = `${MOD_ID}:chalk`;
const game = await setupGame();

test("custom-terrain chalk is registered", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const type = await game.evaluate((id: string) => {
    try {
      const value = sandkit.api.terrains.getTypeById(id);
      return typeof value === "number" && Number.isFinite(value) ? value : null;
    } catch {
      return null;
    }
  }, TERRAIN_ID);
  assert.equal(typeof type, "number");
});
