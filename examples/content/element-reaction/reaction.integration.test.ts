import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.element-reaction";
const game = await setupGame();

test("element-reaction sand water and wetSand types resolve", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const types = await game.evaluate(() => {
    const sand = sandkit.api.elements.getTypeById("sand");
    const water = sandkit.api.elements.getTypeById("water");
    const wetSand = sandkit.api.elements.getTypeById("wetSand");
    return {
      sand: typeof sand === "number" && Number.isFinite(sand),
      water: typeof water === "number" && Number.isFinite(water),
      wetSand: typeof wetSand === "number" && Number.isFinite(wetSand),
    };
  });
  assert.equal(types.sand, true);
  assert.equal(types.water, true);
  assert.equal(types.wetSand, true);
});
