import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.register-structure";
const STRUCTURE_ID = `${MOD_ID}:beacon`;
const SPRITE_ID = `${MOD_ID}:beacon-sprite`;
/** Fixed Void-save cell on the Empty.save platform (snap-grid aligned). */
const BEACON_CELL = { x: 2040, y: 1612 };
const game = await setupGame();

describe("register-structure", { concurrency: false }, () => {
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

  test("beacon builds at a platform cell", async (t) => {
    const ids = await game.orderedModIds();
    if (!ids.includes(MOD_ID)) {
      t.skip(`${MOD_ID} is not loaded`);
      return;
    }

    await game.evaluate(
      (x: number, y: number) => {
        if (sandkit.api.structures.getAtCell(x, y)) {
          sandkit.api.structures.removeAtCell(x, y);
        }
      },
      BEACON_CELL.x,
      BEACON_CELL.y,
    );

    await game.buildStructures([{ type: STRUCTURE_ID, x: BEACON_CELL.x, y: BEACON_CELL.y }]);

    const type = await game.evaluate(
      (x: number, y: number) => sandkit.api.structures.getAtCell(x, y)?.type ?? null,
      BEACON_CELL.x,
      BEACON_CELL.y,
    );
    assert.equal(type, STRUCTURE_ID);
  });
});
