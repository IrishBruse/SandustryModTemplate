import assert from "node:assert/strict";
import test from "node:test";
import { cacheBust, decideReload, isUsableSource, shouldReload } from "./poll.ts";

test("cacheBust appends t= on clean and existing query URLs", () => {
  assert.equal(cacheBust("sandkit-workshop://a/main.js", 7), "sandkit-workshop://a/main.js?t=7");
  assert.equal(cacheBust("file:///mods/a/main.js?x=1", 7), "file:///mods/a/main.js?x=1&t=7");
});

test("shouldReload ignores empty and unchanged text", () => {
  assert.equal(shouldReload(undefined, ""), false);
  assert.equal(shouldReload("code", "   "), false);
  assert.equal(shouldReload("code", "code"), false);
  assert.equal(shouldReload("old", "new"), true);
  assert.equal(isUsableSource("\n"), false);
});

test("decideReload baselines, arms, then reloads on a settled write", () => {
  assert.equal(decideReload(undefined, undefined, ""), "skip");
  assert.equal(decideReload(undefined, undefined, "v1"), "baseline");
  assert.equal(decideReload("v1", undefined, "v1"), "skip");
  assert.equal(decideReload("v1", undefined, "v2"), "arm");
  assert.equal(decideReload("v1", "v2", "v3"), "arm");
  assert.equal(decideReload("v1", "v2", "v2"), "reload");
  assert.equal(decideReload("v2", undefined, "   "), "skip");
});
