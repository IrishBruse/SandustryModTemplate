import assert from "node:assert/strict";
import { test } from "node:test";
import { STATION_SIZE, TILE_CELLS } from "../constants.ts";
import {
  cartIsAtLoader,
  cartIsAtUnloader,
  loaderDockCell,
  pickUnloadCell,
  stationIntakeCells,
  stationOutputCells,
  unloaderDockCell,
} from "./dock.ts";

test("loader dock sits on the rail stamp under the hopper", () => {
  assert.deepEqual(loaderDockCell(10, 20), { x: 10, y: 24 });
});

test("cart on the rail under the hopper is at the loader", () => {
  assert.equal(cartIsAtLoader(10, 24, 10, 20), true);
  assert.equal(cartIsAtLoader(10, 20, 10, 20), true);
  assert.equal(cartIsAtLoader(14, 24, 10, 20), false);
});

test("unloader dock sits on the rail stamp above the dump pad", () => {
  assert.deepEqual(unloaderDockCell(10, 24), { x: 10, y: 20 });
});

test("cart on the rail above the dump pad is at the unloader", () => {
  assert.equal(cartIsAtUnloader(10, 20, 10, 24), true);
  assert.equal(cartIsAtUnloader(10, 24, 10, 24), true);
  assert.equal(cartIsAtUnloader(10, 28, 10, 24), false);
});

test("intake scans the pile above the hopper first", () => {
  const cells = stationIntakeCells(10, 20);
  assert.deepEqual(cells[0], { x: 10, y: 19 });
  assert.equal(
    cells.some((cell) => cell.x === 10 && cell.y === 20),
    true,
  );
  assert.equal(
    cells.some((cell) => cell.x === 10 && cell.y === 24),
    true,
  );
  assert.equal(
    cells.length,
    STATION_SIZE * TILE_CELLS * 2 + STATION_SIZE * STATION_SIZE + STATION_SIZE * TILE_CELLS,
  );
});

test("output is the cells under the dump pad", () => {
  const cells = stationOutputCells(10, 24);
  assert.equal(
    cells.some((cell) => cell.x === 10 && cell.y === 28),
    true,
  );
  assert.equal(
    cells.some((cell) => cell.x === 10 && cell.y === 24),
    false,
  );
});

test("unload picks the top empty row, not a random mid-air cell", () => {
  const empty = new Set(["11,28", "12,29", "13,30"]);
  const cell = pickUnloadCell(
    10,
    24,
    (x, y) => empty.has(`${x},${y}`),
    () => 0,
  );
  assert.deepEqual(cell, { x: 11, y: 28 });
  const ys = new Set<number>();
  for (let i = 0; i < 8; i += 1) {
    const picked = pickUnloadCell(
      10,
      24,
      () => true,
      () => i / 8,
    );
    assert.ok(picked);
    ys.add(picked.y);
    assert.equal(picked.y, 28);
  }
  assert.equal(ys.size, 1);
});
