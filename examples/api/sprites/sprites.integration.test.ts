import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.sprites";
const SPRITE_ID = `${MOD_ID}:demo`;
const game = await setupGame();

test("sprites demo sprite is loaded", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const loaded = await game.waitFor(
    (id: string) => sandkit.api.sprites.getById(id) !== undefined,
    (present) => present === true,
    { args: [SPRITE_ID], message: "sprite did not load", timeoutMs: 4000 },
  );
  assert.equal(loaded, true);
});
