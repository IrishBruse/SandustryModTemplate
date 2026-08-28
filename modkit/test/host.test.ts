import assert from "node:assert/strict";
import test from "node:test";
import { hostWindowMode } from "./host.ts";

test("hostWindowMode uses a window when visible", () => {
  assert.equal(hostWindowMode({ visible: true, platform: "win32" }), "window");
  assert.equal(hostWindowMode({ visible: true, platform: "linux" }), "window");
});

test("hostWindowMode is headless on Windows by default", () => {
  assert.equal(hostWindowMode({ platform: "win32" }), "headless");
});

test("hostWindowMode uses xvfb on Unix by default", () => {
  assert.equal(hostWindowMode({ platform: "linux" }), "xvfb");
  assert.equal(hostWindowMode({ platform: "darwin" }), "xvfb");
});
