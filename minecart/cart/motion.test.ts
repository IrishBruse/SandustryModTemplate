import assert from "node:assert/strict";
import { test } from "node:test";
import { lerpCell } from "./motion.ts";

test("lerpCell mixes from the last rail to the next", () => {
  assert.deepEqual(lerpCell(0, 0, 4, 0, 0), { x: 0, y: 0 });
  assert.deepEqual(lerpCell(0, 0, 4, 0, 0.5), { x: 2, y: 0 });
  assert.deepEqual(lerpCell(0, 0, 4, 4, 1), { x: 4, y: 4 });
});
