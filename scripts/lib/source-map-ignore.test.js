import assert from "node:assert/strict";
import test from "node:test";
import {
  CONSOLE_INJECT_SOURCE_SUFFIX,
  HOT_RELOAD_POLLER_SOURCE_SUFFIXES,
  debugIgnoreSourceSuffixes,
  markDebugSourcesIgnored,
} from "./source-map-ignore.js";

test("markDebugSourcesIgnored lists console inject and dev-tools poller files", () => {
  const map = {
    sources: [
      "file:///repo/modkit/internal/esbuild/console.ts",
      "file:///repo/src/template/main.ts",
      "file:///repo/src/dev-tools/reload/hot-eval.ts",
      "file:///repo/src/dev-tools/reload/install.ts",
      "file:///repo/src/dev-tools/main.ts",
    ],
  };
  markDebugSourcesIgnored(map, debugIgnoreSourceSuffixes());
  assert.deepEqual(map.ignoreList, [0, 2, 3]);
});

test("markDebugSourcesIgnored keeps existing ignoreList entries", () => {
  const map = {
    sources: ["a.ts", CONSOLE_INJECT_SOURCE_SUFFIX],
    ignoreList: [0],
  };
  markDebugSourcesIgnored(map, [CONSOLE_INJECT_SOURCE_SUFFIX]);
  assert.deepEqual(map.ignoreList, [0, 1]);
});

test("dev-tools poller suffixes are the eval and poll loop files", () => {
  assert.deepEqual(HOT_RELOAD_POLLER_SOURCE_SUFFIXES, [
    "src/dev-tools/reload/hot-eval.ts",
    "src/dev-tools/reload/install.ts",
  ]);
});
