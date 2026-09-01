import assert from "node:assert/strict";
import test from "node:test";
import {
  CONSOLE_INJECT_SOURCE_SUFFIX,
  debugIgnoreSourceSuffixes,
  markDebugSourcesIgnored,
} from "./source-map-ignore.js";

test("markDebugSourcesIgnored lists console inject file", () => {
  const map = {
    sources: [
      "file:///repo/modkit/internal/esbuild/console.ts",
      "file:///repo/src/template/main.ts",
    ],
  };
  markDebugSourcesIgnored(map, debugIgnoreSourceSuffixes());
  assert.deepEqual(map.ignoreList, [0]);
});

test("markDebugSourcesIgnored keeps existing ignoreList entries", () => {
  const map = {
    sources: ["a.ts", CONSOLE_INJECT_SOURCE_SUFFIX],
    ignoreList: [0],
  };
  markDebugSourcesIgnored(map, [CONSOLE_INJECT_SOURCE_SUFFIX]);
  assert.deepEqual(map.ignoreList, [0, 1]);
});
