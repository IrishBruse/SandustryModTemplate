import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_CAPTURE_SCALE, readCaptureScale } from "./modScale.ts";

test("readCaptureScale defaults to 1 and clamps to 1–8", () => {
  assert.equal(readCaptureScale(undefined), DEFAULT_CAPTURE_SCALE);
  assert.equal(readCaptureScale("bad"), DEFAULT_CAPTURE_SCALE);
  assert.equal(readCaptureScale(0), 1);
  assert.equal(readCaptureScale(99), 8);
  assert.equal(readCaptureScale(2.6), 3);
  assert.equal(readCaptureScale(1), 1);
});
