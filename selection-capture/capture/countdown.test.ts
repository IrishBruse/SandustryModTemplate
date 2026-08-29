import assert from "node:assert/strict";
import { test } from "node:test";
import { waitCountdownSeconds } from "./countdown.ts";

test("waitCountdownSeconds with 0 skips waits", async () => {
  const ticks: number[] = [];
  const result = await waitCountdownSeconds(0, undefined, (n) => ticks.push(n));
  assert.equal(result, "ok");
  assert.deepEqual(ticks, []);
});

test("waitCountdownSeconds counts down and can cancel", async () => {
  const ticks: number[] = [];
  const abort = new AbortController();
  const pending = waitCountdownSeconds(3, abort.signal, (n) => {
    ticks.push(n);
    if (n === 2) abort.abort();
  });
  const result = await pending;
  assert.equal(result, "cancelled");
  assert.deepEqual(ticks, [3, 2]);
});
