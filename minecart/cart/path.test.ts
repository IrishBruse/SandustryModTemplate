import assert from "node:assert/strict";
import { test } from "node:test";
import { nextStep } from "./path.ts";
import { cellKey } from "../rail/tiles.ts";

test("continues into the unique forward neighbor", () => {
  const step = nextStep(
    { x: 1, y: 0 },
    1,
    0,
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ],
    new Set(),
  );
  assert.deepEqual(step, { cell: { x: 2, y: 0 }, lastDx: 1, lastDy: 0, wait: false });
});

test("reverses at a dead end", () => {
  const step = nextStep({ x: 2, y: 0 }, 1, 0, [{ x: 1, y: 0 }], new Set());
  assert.deepEqual(step, { cell: { x: 1, y: 0 }, lastDx: -1, lastDy: 0, wait: false });
});

test("waits when the next cell is occupied", () => {
  const occupied = new Set([cellKey(2, 0)]);
  const step = nextStep(
    { x: 1, y: 0 },
    1,
    0,
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ],
    occupied,
  );
  assert.equal(step.wait, true);
  assert.deepEqual(step.cell, { x: 1, y: 0 });
});

test("climbs a rise-right ramp without a vertical last delta", () => {
  const step = nextStep(
    { x: 5, y: 10 },
    1,
    0,
    [
      { x: 4, y: 10 },
      { x: 6, y: 9 },
    ],
    new Set(),
  );
  assert.deepEqual(step.cell, { x: 6, y: 9 });
  assert.equal(step.lastDx, 1);
  assert.equal(step.lastDy, -1);
});

test("with no heading, picks the first open neighbor", () => {
  const step = nextStep(
    { x: 0, y: 0 },
    0,
    0,
    [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ],
    new Set(),
  );
  assert.equal(step.wait, false);
  assert.deepEqual(step.cell, { x: 1, y: 0 });
});
