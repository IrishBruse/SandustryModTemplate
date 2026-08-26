import assert from "node:assert/strict";
import test from "node:test";
import { hostWindowMode } from "./host.ts";

test("hostWindowMode uses a window when visible", () => {
  assert.equal(hostWindowMode({ visible: true, platform: "win32", display: undefined }), "window");
  assert.equal(hostWindowMode({ visible: true, platform: "linux", display: undefined }), "window");
});

test("hostWindowMode is headless on Windows by default", () => {
  assert.equal(hostWindowMode({ platform: "win32", display: ":0" }), "headless");
});

test("hostWindowMode uses xvfb on Unix without DISPLAY", () => {
  assert.equal(hostWindowMode({ platform: "linux", display: undefined }), "xvfb");
});

test("hostWindowMode uses a window on Unix with DISPLAY", () => {
  assert.equal(hostWindowMode({ platform: "linux", display: ":0" }), "window");
});
