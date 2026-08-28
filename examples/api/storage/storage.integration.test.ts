import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.storage";
const game = await setupGame();

test("storage.ensure has the example load count", async (t) => {
  const loadCount = await game.evaluate((id: string) => {
    const bag = sandkit.api.storage.ensure(id);
    return typeof bag.loadCount === "number" ? bag.loadCount : null;
  }, MOD_ID);
  if (loadCount == null) {
    t.skip("example.storage is not loaded");
    return;
  }
  assert.ok(loadCount >= 1);
});
