import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { setTimeout as sleep } from "node:timers/promises";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.collector-element";
const ELEMENT_ID = `${MOD_ID}:platinum`;
const COLLECTABLE_VALUE = 2;
/** Fixed Void-save cell on the Empty.save platform (snap-grid aligned). */
const COLLECTOR_CELL = { x: 2000, y: 1612 };
const CELL_SIZE = 4;
/** Extra pause only for `:view` so steps stay readable on screen. */
const VIEW_DELAY_MS = process.env.SANDUSTRY_TEST_VIEW === "1" ? 1500 : 0;
const game = await setupGame();

async function viewPause(): Promise<void> {
  if (VIEW_DELAY_MS <= 0) return;
  await sleep(VIEW_DELAY_MS);
}

describe("collector-element", { concurrency: false }, () => {
  test("Platinum has collector value 2", async (t) => {
    const ids = await game.orderedModIds();
    if (!ids.includes(MOD_ID)) {
      t.skip(`${MOD_ID} is not loaded`);
      return;
    }
    const value = await game.evaluate((id: string) => {
      try {
        const type = sandkit.api.elements.getTypeById(id);
        if (typeof type !== "number" || !Number.isFinite(type)) return null;
        return sandkit.api.collector.getValueByType(type);
      } catch {
        return null;
      }
    }, ELEMENT_ID);
    assert.equal(value, COLLECTABLE_VALUE);
  });

  test("Platinum on a Collector increases gold", async (t) => {
    const ids = await game.orderedModIds();
    if (!ids.includes(MOD_ID)) {
      t.skip(`${MOD_ID} is not loaded`);
      return;
    }

    const placed = await game.evaluate(
      (elementId: string, cellX: number, cellY: number, cellSize: number) => {
        const api = sandkit.api;
        const st = sandkit.engine.state;
        if (st.session) st.session.paused = false;

        const collectorType = sandkit.enums.StructureType.Collector;
        if (api.structures.getAtCell(cellX, cellY)) {
          api.structures.removeAtCell(cellX, cellY);
        }
        api.structures.buildAtCell(cellX, cellY, collectorType);

        let elementType: number;
        try {
          elementType = api.elements.getTypeById(elementId);
        } catch {
          return { ok: false as const, reason: `${elementId} is not registered` };
        }
        if (typeof elementType !== "number" || !Number.isFinite(elementType)) {
          return { ok: false as const, reason: `${elementId} is not registered` };
        }

        const worldX = (cellX + 2) * cellSize;
        const worldY = (cellY + 2) * cellSize;
        api.camera.setFocusAtWorld(worldX, worldY);

        return { ok: true as const, sx: cellX, sy: cellY, elementType, collectorType };
      },
      ELEMENT_ID,
      COLLECTOR_CELL.x,
      COLLECTOR_CELL.y,
      CELL_SIZE,
    );

    if (!placed.ok) {
      t.skip(placed.reason);
      return;
    }

    await viewPause();

    await game.waitFor(
      (sx: number, sy: number, collectorType: number) =>
        sandkit.api.structures.getAtCell(sx, sy)?.type === collectorType,
      (ready) => ready === true,
      {
        args: [placed.sx, placed.sy, placed.collectorType],
        message: "collector did not build",
        timeoutMs: 8000,
      },
    );

    await viewPause();

    const before = await game.evaluate(() => Number(sandkit.engine.state.shared.gold[0]));

    await game.evaluate(
      (sx: number, sy: number, elementType: number) => {
        sandkit.api.elements.createAtCell(sx, sy, elementType);
        sandkit.api.elements.createAtCell(sx + 1, sy, elementType);
      },
      placed.sx,
      placed.sy,
      placed.elementType,
    );

    await viewPause();

    const after = await game.waitFor(
      () => Number(sandkit.engine.state.shared.gold[0]),
      (gold) => gold >= before + COLLECTABLE_VALUE,
      { message: "collector did not add gold for Platinum", timeoutMs: 8000 },
    );

    assert.ok(after >= before + COLLECTABLE_VALUE);
    await viewPause();
  });
});
