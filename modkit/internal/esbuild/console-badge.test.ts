import assert from "node:assert/strict";
import test from "node:test";
import { badgeCss } from "./console-badge.ts";

test("badgeCss uses distinct colors per severity", () => {
  const log = badgeCss("log");
  const warn = badgeCss("warn");
  const error = badgeCss("error");
  assert.match(log, /background:#0b1220/);
  assert.match(log, /color:#7dd3fc/);
  assert.match(warn, /color:#fbbf24/);
  assert.match(error, /color:#fca5a5/);
  assert.match(log, /font-weight:700/);
  assert.notEqual(log, warn);
  assert.notEqual(warn, error);
});
