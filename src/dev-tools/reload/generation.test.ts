import assert from "node:assert/strict";
import test from "node:test";
import { formatHotToastMessage, hotGeneration, nextHotGeneration } from "./generation.ts";

test("nextHotGeneration increments per mod from 1", () => {
  const a = `gen-a-${Math.random()}`;
  const b = `gen-b-${Math.random()}`;
  assert.equal(hotGeneration(a), 0);
  assert.equal(nextHotGeneration(a), 1);
  assert.equal(nextHotGeneration(a), 2);
  assert.equal(nextHotGeneration(b), 1);
  assert.equal(hotGeneration(a), 2);
  assert.equal(hotGeneration(b), 1);
});

test("formatHotToastMessage appends mod id and generation", () => {
  assert.equal(
    formatHotToastMessage("Template loaded", "author.template", 4),
    "Template loaded (author.template v4)",
  );
  assert.equal(formatHotToastMessage(42, "m", 1), "42 (m v1)");
});
