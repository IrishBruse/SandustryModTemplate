import assert from "node:assert/strict";
import { join } from "node:path";
import test from "node:test";
import { extractedDistDir, repoRoot } from "./paths.ts";
import { buildPatchedDistSources, collectTestHostPatches } from "./patched-dist.ts";

const BUILT_MODS = join(repoRoot(), "dist");

test("collectTestHostPatches reads hot-reload stash patch from built mods", () => {
  const patches = collectTestHostPatches(BUILT_MODS);
  assert.ok(patches.length > 0);
  assert.ok(
    patches.some(
      (patch) =>
        typeof patch === "object" &&
        patch !== null &&
        (patch as { id?: string }).id === "stash-sandkit-by-mod",
    ),
  );
});

test("buildPatchedDistSources applies stash-sandkit-by-mod to external-mod-runtime.js", (t) => {
  const distDir = extractedDistDir();
  if (!distDir) {
    t.skip("No extracted sandustry dist. Run npm run setup.");
    return;
  }
  const patches = collectTestHostPatches(BUILT_MODS);
  const patched = buildPatchedDistSources(distDir, { modsDir: BUILT_MODS, patches });
  const runtime = patched.get("js/external-mod-runtime.js");
  assert.ok(runtime?.includes("__sandkitByMod"), "stash patch missing from served runtime");
});
