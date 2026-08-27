import assert from "node:assert/strict";
import test from "node:test";
import { DEBUG_BADGE_ELEMENT_ID, earlyDebugBadgePatchIife } from "./mount.ts";

test("earlyDebugBadgePatchIife mounts fixed top-left debug text on document.body", () => {
  const code = earlyDebugBadgePatchIife();
  assert.match(code, new RegExp(DEBUG_BADGE_ELEMENT_ID));
  assert.match(code, /position:"fixed"/);
  assert.match(code, /top:"0"/);
  assert.match(code, /left:"0"/);
  assert.match(code, /zIndex:"2147483647"/);
  assert.match(code, /textContent="debug"/);
  assert.match(code, /DOMContentLoaded/);
});
