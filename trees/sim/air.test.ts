import assert from "node:assert/strict";
import { test } from "node:test";
import { countAdjacentAir } from "./air.ts";

test("countAdjacentAir is 8 when every neighbor is empty", () => {
  assert.equal(
    countAdjacentAir(() => true, 10, 10),
    8,
  );
});

test("countAdjacentAir is 0 when no neighbor is empty", () => {
  assert.equal(
    countAdjacentAir(() => false, 10, 10),
    0,
  );
});

test("countAdjacentAir counts only empty ortho-8 neighbors", () => {
  const empty = new Set(["11,9", "9,11"]);
  const count = countAdjacentAir((x, y) => empty.has(`${x},${y}`), 10, 10);
  assert.equal(count, 2);
});
