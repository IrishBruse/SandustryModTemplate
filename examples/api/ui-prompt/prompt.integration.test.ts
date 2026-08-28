import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.ui-prompt";
const BINDING_ID = `${MOD_ID}.prompt`;
const game = await setupGame();

test("ui-prompt binding is registered", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const keys = await game.evaluate((id: string) => sandkit.api.input.getBoundKeys(id), BINDING_ID);
  assert.ok(keys.includes("KeyU"));
});
