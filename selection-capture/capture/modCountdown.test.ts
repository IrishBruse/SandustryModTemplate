import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_COUNTDOWN, readCountdownSeconds } from "./modCountdown.ts";

test("readCountdownSeconds clamps to 0–10 and defaults to 3", () => {
  assert.equal(readCountdownSeconds(undefined), DEFAULT_COUNTDOWN);
  assert.equal(readCountdownSeconds("bad"), DEFAULT_COUNTDOWN);
  assert.equal(readCountdownSeconds(-1), 0);
  assert.equal(readCountdownSeconds(99), 10);
  assert.equal(readCountdownSeconds(5.7), 6);
  assert.equal(readCountdownSeconds(0), 0);
});
