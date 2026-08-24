import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const PATCHES = readFileSync(join(DIR, "../patches.ts"), "utf8");
const RUNTIME = join(DIR, "../../../sandustry/dist/js/external-mod-runtime.js");

test("compile wrapper calls __sandkitWrapForDispose", () => {
  assert.match(PATCHES, /__sandkitWrapForDispose/);
  assert.match(PATCHES, /local-mod-compile-reloaded/);
  assert.match(PATCHES, /__sandkitLocalModRegistry__/);
  assert.doesNotMatch(PATCHES, /local-mod-track-events/);
  assert.doesNotMatch(PATCHES, /local-mod-track-inject/);
  assert.doesNotMatch(PATCHES, /local-mod-track-overlays/);
  assert.doesNotMatch(PATCHES, /ev\.on=/);
});

test("loader patch finds still exist in extracted external-mod-runtime.js", (t) => {
  if (!existsSync(RUNTIME)) {
    t.skip("sandustry/dist is missing — run npm run setup");
    return;
  }
  const source = readFileSync(RUNTIME, "utf8");
  const finds = [
    'return new Function("__sandkit",`"use strict";\\nconst sandkit = __sandkit;\\nreturn (async () => {\\n${e.entrySource}\\n})();\\n//# sourceURL=${r}`)',
    "const t=ie(e,{manifest:i,discovered:r});e.store.integrity.modsUsed=!0,await c(t)",
  ];
  for (const find of finds) {
    const matches = source.split(find).length - 1;
    assert.equal(matches, 1, `expected 1 match for ${find.slice(0, 80)}`);
  }
});
