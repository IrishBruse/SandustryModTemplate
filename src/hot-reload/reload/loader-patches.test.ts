import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));

test("inject tracking uses the sandkit mod id, not the last active id", () => {
  const source = readFileSync(join(DIR, "../patches.ts"), "utf8");
  assert.match(source, /tr&&e&&tr\(e,d\)/);
  assert.doesNotMatch(
    source,
    /var a=globalThis\.__sandkitHotReloadActive__,tr=globalThis\.__sandkitTrackInjectDispose/,
  );
  assert.match(source, /local-mod-track-overlays/);
});
