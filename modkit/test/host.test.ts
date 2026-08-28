import assert from "node:assert/strict";
import test from "node:test";
import { hostWindowMode } from "./chrome.ts";

test("hostWindowMode uses a window when visible and a display exists", () => {
  assert.equal(hostWindowMode({ visible: true, platform: "win32" }), "window");
  assert.equal(hostWindowMode({ visible: true, platform: "linux", display: ":1" }), "window");
});

test("hostWindowMode is headless on Windows by default", () => {
  assert.equal(hostWindowMode({ platform: "win32" }), "headless");
});

test("hostWindowMode uses xvfb on Unix when there is no DISPLAY", () => {
  assert.equal(hostWindowMode({ visible: true, platform: "linux", display: undefined }), "xvfb");
  assert.equal(hostWindowMode({ platform: "linux", display: undefined }), "xvfb");
  assert.equal(hostWindowMode({ platform: "darwin", display: undefined }), "xvfb");
});
