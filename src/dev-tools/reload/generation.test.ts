import assert from "node:assert/strict";
import test from "node:test";
import { hotGeneration, nextHotGeneration } from "./generation.ts";

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
