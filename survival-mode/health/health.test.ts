import assert from "node:assert/strict";
import test from "node:test";
import { HEALTH_MAX, resolveStoredHealth } from "./storedHealth.ts";

test("resolveStoredHealth defaults missing or zero to full health", () => {
  assert.equal(resolveStoredHealth(undefined), HEALTH_MAX);
  assert.equal(resolveStoredHealth(null), HEALTH_MAX);
  assert.equal(resolveStoredHealth(0), HEALTH_MAX);
  assert.equal(resolveStoredHealth(-5), HEALTH_MAX);
  assert.equal(resolveStoredHealth(Number.NaN), HEALTH_MAX);
});

test("resolveStoredHealth keeps valid partial health", () => {
  assert.equal(resolveStoredHealth(50), 50);
  assert.equal(resolveStoredHealth(100), 100);
  assert.equal(resolveStoredHealth(150), 100);
});
