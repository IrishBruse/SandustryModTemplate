import assert from "node:assert/strict";
import { test } from "node:test";
import { cargoPileCells } from "./cargoPile.ts";
import { MAX_CARGO } from "../constants.ts";

test("empty cargo draws no pile cells", () => {
  assert.deepEqual(cargoPileCells(0, MAX_CARGO, 10, 8), []);
});

test("pile grows taller and wider as cargo increases", () => {
  const low = cargoPileCells(8, MAX_CARGO, 12, 10);
  const high = cargoPileCells(48, MAX_CARGO, 12, 10);
  assert.ok(high.length > low.length);
  const lowMaxY = Math.max(...low.map(([, y]) => y));
  const highMaxY = Math.max(...high.map(([, y]) => y));
  assert.ok(highMaxY >= lowMaxY);
});

test("full pile stays inside the interior box", () => {
  const w = 14;
  const h = 12;
  for (const cell of cargoPileCells(MAX_CARGO, MAX_CARGO, w, h)) {
    const [x, y] = cell;
    assert.ok(x >= 0 && x < w);
    assert.ok(y >= 0 && y < h);
  }
});
