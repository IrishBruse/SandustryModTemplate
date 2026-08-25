import assert from "node:assert/strict";
import test from "node:test";
import { cacheBust, isUsableSource, shouldReload } from "./poll.ts";

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
