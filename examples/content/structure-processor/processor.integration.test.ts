import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.structure-processor";
const STRUCTURE_ID = `${MOD_ID}:scanner`;
const SPRITE_ID = `${MOD_ID}:scanner-sprite`;
/** Fixed Void-save cell on the Empty.save platform (snap-grid aligned). */
const SCANNER_CELL = { x: 2080, y: 1612 };
const game = await setupGame();

describe("structure-processor", { concurrency: false }, () => {
  test("structure-processor scanner and sprite are registered", async (t) => {
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
      { args: [STRUCTURE_ID, SPRITE_ID], message: "scanner did not register", timeoutMs: 4000 },
    );
    assert.equal(live.structure, true);
    assert.equal(live.sprite, true);
  });

  test("scanner builds at a platform cell", async (t) => {
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
      SCANNER_CELL.x,
      SCANNER_CELL.y,
    );

    await game.buildStructures([{ type: STRUCTURE_ID, x: SCANNER_CELL.x, y: SCANNER_CELL.y }]);

    const type = await game.evaluate(
      (x: number, y: number) => sandkit.api.structures.getAtCell(x, y)?.type ?? null,
      SCANNER_CELL.x,
      SCANNER_CELL.y,
    );
    assert.equal(type, STRUCTURE_ID);
  });
});
