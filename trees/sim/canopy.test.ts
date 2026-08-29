import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CANOPY_MAX_HALF_WIDTH,
  CANOPY_ROWS,
  CANOPY_TIP_OFFSET_CELLS,
  TRUNK_HALF_WIDTH,
} from "./constants.ts";
import { canopyHalfWidth, canopyRowCells, canopyTipY, canopyTreeTopY } from "./canopy.ts";

test("canopyHalfWidth is 1 at the treetop", () => {
  assert.equal(canopyHalfWidth(0), 1);
});

test("canopyHalfWidth is max at the bottom of the canopy", () => {
  assert.equal(canopyHalfWidth(CANOPY_ROWS - 1), CANOPY_MAX_HALF_WIDTH);
});

test("canopyHalfWidth stays inside 1–max", () => {
  for (let row = 0; row < CANOPY_ROWS; row += 1) {
    const width = canopyHalfWidth(row);
    assert.ok(width >= 1 && width <= CANOPY_MAX_HALF_WIDTH, `row ${row} width ${width}`);
  }
});

test("canopyRowCells skips the trunk columns", () => {
  const cells = canopyRowCells(10, 100, CANOPY_ROWS - 1);
  assert.ok(cells.length > 0);
  const trunkTopY = canopyTreeTopY(100);
  for (const cell of cells) {
    if (cell.y >= trunkTopY) {
      assert.ok(Math.abs(cell.x - 10) > TRUNK_HALF_WIDTH);
    }
  }
  assert.equal(Math.max(...cells.map((cell) => Math.abs(cell.x - 10))), CANOPY_MAX_HALF_WIDTH);
});

test("the needle cone starts above the top trunk row", () => {
  const rootY = 100;
  const tipY = canopyTipY(rootY);
  const trunkTopY = canopyTreeTopY(rootY);
  assert.equal(trunkTopY - tipY, CANOPY_TIP_OFFSET_CELLS);
  assert.ok(tipY < trunkTopY);
  const firstRow = canopyRowCells(10, rootY, 0);
  assert.ok(firstRow.some((cell) => cell.x === 10));
  for (const cell of firstRow) {
    assert.equal(cell.y, tipY + 1);
    assert.ok(cell.y < trunkTopY);
  }
});
