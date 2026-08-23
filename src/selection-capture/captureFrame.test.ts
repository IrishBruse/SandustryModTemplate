import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BORDER_PX,
  clipRectToCanvas,
  getSelectionScreenRect,
  screenRectFromCellCorners,
} from "./captureFrame.ts";

test("BORDER_PX is 1", () => {
  assert.equal(BORDER_PX, 1);
});

test("screenRectFromCellCorners adds a 1 px border", () => {
  assert.deepEqual(screenRectFromCellCorners({ x: 10, y: 20 }, { x: 40, y: 50 }), {
    x: 9,
    y: 19,
    width: 32,
    height: 32,
  });
});

test("screenRectFromCellCorners returns null for a zero-size box", () => {
  assert.equal(screenRectFromCellCorners({ x: 5, y: 5 }, { x: 5, y: 5 }), null);
});

test("screenRectFromCellCorners returns null for non-finite corners", () => {
  assert.equal(screenRectFromCellCorners({ x: Number.NaN, y: 0 }, { x: 10, y: 10 }), null);
});

test("clipRectToCanvas returns null when the rect is fully off-screen", () => {
  assert.equal(clipRectToCanvas({ x: 100, y: 100, width: 10, height: 10 }, 50, 50), null);
});

test("clipRectToCanvas clips a rect that hangs off the left and top", () => {
  assert.deepEqual(clipRectToCanvas({ x: -4, y: -2, width: 10, height: 8 }, 20, 20), {
    x: 0,
    y: 0,
    width: 6,
    height: 6,
  });
});

test("getSelectionScreenRect maps inclusive cells through getDrawPositionAtCell", () => {
  const api = {
    rendering: {
      getDrawPositionAtCell: (x: number, y: number) => ({ x: x * 8, y: y * 8 }),
    },
  };
  assert.deepEqual(
    getSelectionScreenRect(api as SandkitApi, { minX: 1, minY: 2, maxX: 3, maxY: 4 }),
    {
      x: 8 - 1,
      y: 16 - 1,
      width: 24 + 2,
      height: 24 + 2,
    },
  );
});
