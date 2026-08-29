import assert from "node:assert/strict";
import { test } from "node:test";
import { TILE_CELLS as T } from "../constants.ts";
import { cellKey, linkedCells, snapTile, type TileKind } from "./tiles.ts";

test("snapTile maps any cell in a stamp to the origin", () => {
  assert.deepEqual(snapTile(5, 7), { x: 4, y: 4 });
  assert.deepEqual(snapTile(4, 4), { x: 4, y: 4 });
});

function tiles(entries: [number, number, TileKind][]): Map<string, TileKind> {
  return new Map(entries.map(([x, y, kind]) => [cellKey(x, y), kind]));
}

test("horizontal rails link left and right", () => {
  const map = tiles([
    [0, 0, "rail"],
    [T, 0, "rail"],
    [T * 2, 0, "rail"],
  ]);
  assert.deepEqual(linkedCells(T, 0, map), [
    { x: 0, y: 0 },
    { x: T * 2, y: 0 },
  ]);
});

test("rail does not link straight up", () => {
  const map = tiles([
    [0, 0, "rail"],
    [0, -T, "rail"],
  ]);
  assert.deepEqual(linkedCells(0, 0, map), []);
});

test("rise-right ramp links the lower rail and the upper-right rail", () => {
  const map = tiles([
    [0, T * 2, "rail"],
    [T, T * 2, "rampRiseRight"],
    [T * 2, T, "rail"],
  ]);
  assert.deepEqual(linkedCells(T, T * 2, map), [
    { x: 0, y: T * 2 },
    { x: T * 2, y: T },
  ]);
  assert.deepEqual(linkedCells(T * 2, T, map), [{ x: T, y: T * 2 }]);
});

test("rise-left ramp links the lower rail and the upper-left rail", () => {
  const map = tiles([
    [T * 2, T * 2, "rail"],
    [T, T * 2, "rampRiseLeft"],
    [0, T, "rail"],
  ]);
  assert.deepEqual(linkedCells(T, T * 2, map), [
    { x: T * 2, y: T * 2 },
    { x: 0, y: T },
  ]);
});
