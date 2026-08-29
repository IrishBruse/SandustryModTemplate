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

    const prepared = await game.evaluate(
      (elementId: string, cellX: number, cellY: number, cellSize: number) => {
        const api = sandkit.api;
        if (api.structures.getAtCell(cellX, cellY)) {
          api.structures.removeAtCell(cellX, cellY);
        }

        let elementOk = false;
        try {
          const elementType = api.elements.getTypeById(elementId);
          elementOk = typeof elementType === "number" && Number.isFinite(elementType);
        } catch {
          elementOk = false;
        }
        if (!elementOk) {
          return { ok: false as const, reason: `${elementId} is not registered` };
        }

        const collectorType = sandkit.enums.StructureType.Collector;
        api.camera.setFocusAtWorld((cellX + 2) * cellSize, (cellY + 2) * cellSize);
        return { ok: true as const, collectorType };
      },
      ELEMENT_ID,
      COLLECTOR_CELL.x,
      COLLECTOR_CELL.y,
      CELL_SIZE,
    );

    if (!prepared.ok) {
      t.skip(prepared.reason);
      return;
    }

    await viewPause();

    const before = await game.evaluate(() => {
      const shared = sandkit.engine.state.shared as { gold: ArrayLike<number> };
      return Number(shared.gold[0]);
    });

    await game.buildLayout({
      origin: COLLECTOR_CELL,
      cells: ["c"],
      legend: {
        c: { type: prepared.collectorType },
      },
      seeds: [{ x: 0, y: 0, element: ELEMENT_ID, count: 2 }],
    });

    await viewPause();

    await game.resumeSimulation();
    try {
      const after = await game.waitFor(
        () => {
          const shared = sandkit.engine.state.shared as { gold: ArrayLike<number> };
          return Number(shared.gold[0]);
        },
        (gold) => gold >= before + COLLECTABLE_VALUE,
        { message: "collector did not add gold for Platinum", timeoutMs: 8000 },
      );
      assert.ok(after >= before + COLLECTABLE_VALUE);
    } finally {
      await game.pauseSimulation();
    }

    await viewPause();
  });
});
