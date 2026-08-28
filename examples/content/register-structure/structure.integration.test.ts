import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.register-structure";
const STRUCTURE_ID = `${MOD_ID}:beacon`;
const SPRITE_ID = `${MOD_ID}:beacon-sprite`;
const game = await setupGame();

test("register-structure beacon and sprite are registered", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const live = await game.waitFor(
    (structureId: string, spriteId: string) => {
      let structure = false;
      try {
        structure = sandkit.api.structures.getTypeById(structureId) != null;
      } catch {
        structure = false;
      }
      return {
        structure,
        sprite: sandkit.api.sprites.getById(spriteId) !== undefined,
      };
    },
    (value) => value.structure && value.sprite,
    { args: [STRUCTURE_ID, SPRITE_ID], message: "beacon did not register", timeoutMs: 4000 },
  );
  assert.equal(live.structure, true);
  assert.equal(live.sprite, true);
});
