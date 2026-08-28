import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.input-binding";
const BINDING_ID = `${MOD_ID}.toast`;
const game = await setupGame();

test("input-binding toast key is bound", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const keys = await game.evaluate((id: string) => sandkit.api.input.getBoundKeys(id), BINDING_ID);
  assert.ok(keys.includes("KeyT"));
});
