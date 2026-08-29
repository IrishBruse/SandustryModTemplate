import assert from "node:assert/strict";
import { test } from "node:test";
import { preferSupportCell } from "./support.ts";

test("preferSupportCell picks the cell below the seed", () => {
  const seed = { x: 10, y: 5 };
  const picked = preferSupportCell(seed, [
    { x: 11, y: 5 },
    { x: 10, y: 6 },
    { x: 9, y: 5 },
  ]);
  assert.deepEqual(picked, { x: 10, y: 6 });
});

test("preferSupportCell falls back to the first candidate", () => {
  const seed = { x: 10, y: 5 };
  const picked = preferSupportCell(seed, [{ x: 11, y: 5 }]);
  assert.deepEqual(picked, { x: 11, y: 5 });
});

test("preferSupportCell returns null when empty", () => {
  assert.equal(preferSupportCell({ x: 0, y: 0 }, []), null);
});
