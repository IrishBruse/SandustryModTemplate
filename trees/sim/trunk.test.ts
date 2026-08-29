import assert from "node:assert/strict";
import { test } from "node:test";
import { collectConnectedTrunkCells, collapseTrunkAround } from "./trunk.ts";

test("collectConnectedTrunkCells walks a 3-wide trunk and skips gaps", () => {
  const wood = new Set(["9,5", "10,5", "11,5", "9,6", "10,6", "11,6", "10,8"]);
  const isWood = (cellX: number, cellY: number) => wood.has(`${cellX},${cellY}`);
  const cells = collectConnectedTrunkCells(isWood, 10, 6)
    .map((cell) => `${cell.x},${cell.y}`)
    .sort();
  assert.deepEqual(cells, ["10,5", "10,6", "11,5", "11,6", "9,5", "9,6"]);
});

test("collapseTrunkAround drops remaining wood, the shoot, and linked needles", () => {
  const wood = new Set(["2,10", "3,10", "4,10", "2,11", "3,11", "4,11"]);
  const needles = new Set(["2,4", "4,4", "8,4"]);
  const shoots = new Set(["3,9"]);
  const removed: string[] = [];
  const raw: string[] = [];
  const dust: string[] = [];
  collapseTrunkAround(3, 12, {
    isPineWood: (cellX, cellY) => wood.has(`${cellX},${cellY}`),
    isNeedle: (cellX, cellY) => needles.has(`${cellX},${cellY}`),
    isShoot: (cellX, cellY) => shoots.has(`${cellX},${cellY}`),
    needleRootX: (cellX) => (cellX === 8 ? 99 : 3),
    removeWood: (cellX, cellY) => {
      removed.push(`${cellX},${cellY}`);
    },
    dropRawWood: (cellX, cellY) => {
      raw.push(`${cellX},${cellY}`);
    },
    dropLeafDust: (cellX, cellY) => {
      dust.push(`${cellX},${cellY}`);
    },
  });
  assert.deepEqual(removed.sort(), ["2,10", "2,11", "3,10", "3,11", "4,10", "4,11"]);
  assert.ok(raw.includes("3,10"));
  assert.ok(raw.includes("3,9"));
  assert.deepEqual(dust.sort(), ["2,4", "4,4"]);
});
