import assert from "node:assert/strict";
import { test } from "node:test";
import { planMainReload, shouldWarnNoDispose } from "./main-reload-plan.ts";

test("dispose path always evaluates", () => {
  assert.equal(planMainReload(true, "off"), "eval");
  assert.equal(planMainReload(true, "toast"), "eval");
  assert.equal(planMainReload(true, "reload"), "eval");
});

test("toast fallback evaluates when there is no dispose path", () => {
  assert.equal(planMainReload(false, "toast"), "eval");
  assert.equal(shouldWarnNoDispose(false, "eval"), true);
});

test("off skips when there is no dispose path", () => {
  assert.equal(planMainReload(false, "off"), "skip");
  assert.equal(shouldWarnNoDispose(false, "skip"), false);
});

test("reload setting reloads the page when there is no dispose path", () => {
  assert.equal(planMainReload(false, "reload"), "reload");
});
