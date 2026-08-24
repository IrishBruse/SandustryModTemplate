import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BORDER_PX,
  clipRectToCanvas,
  getSelectionScreenRect,
  screenRectFromCellCorners,
} from "./captureFrame.ts";

test("BORDER_PX defaults to 0 for exact cell crops", () => {
  assert.equal(BORDER_PX, 0);
});

test("screenRectFromCellCorners maps exclusive bottom-right corners to inclusive pixels", () => {
  assert.deepEqual(screenRectFromCellCorners({ x: 10, y: 20 }, { x: 40, y: 50 }), {
    x: 10,
    y: 20,
    width: 30,
    height: 30,
  });
});

test("screenRectFromCellCorners can add an optional border", () => {
  assert.deepEqual(screenRectFromCellCorners({ x: 10, y: 20 }, { x: 40, y: 50 }, 1), {
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

test("screenRectFromCellCorners uses floor and ceil so crops stay on whole pixels", () => {
  assert.deepEqual(screenRectFromCellCorners({ x: 10.2, y: 20.7 }, { x: 40.8, y: 50.1 }), {
    x: 10,
    y: 20,
    width: 30,
    height: 30,
  });
  assert.deepEqual(screenRectFromCellCorners({ x: 10.2, y: 20.7 }, { x: 40.8, y: 50.1 }, 1), {
    x: 9,
    y: 19,
    width: 32,
    height: 32,
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
      x: 8,
      y: 16,
      width: 24,
      height: 24,
    },
  );
});
