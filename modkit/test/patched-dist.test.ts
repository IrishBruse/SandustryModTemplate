import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { extractedDistDir, repoRoot } from "./paths.ts";
import { buildPatchedDistSources, collectTestHostPatches } from "./patched-dist.ts";

const BUILT_MODS = join(repoRoot(), "dist");

test("collectTestHostPatches reads dev-tools stash patch from built mods", () => {
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

test("collectTestHostPatches dedupes identical patch ids across mods", () => {
  const root = mkdtempSync(join(tmpdir(), "sandustry-patches-"));
  const shared = [
    {
      id: "collector-admission-value-map-main",
      file: "js/bundle.js",
      find: "FIND",
      operation: "replace",
      code: "CODE",
      expectedMatches: 1,
      atomicGroup: "collector-admission-value-map",
    },
  ];
  for (const id of ["example.collector-element", "example.collector-patches"]) {
    const dir = join(root, id);
    mkdirSync(dir);
    writeFileSync(join(dir, "modinfo.json"), JSON.stringify({ id }));
    writeFileSync(join(dir, "patches.json"), JSON.stringify(shared));
  }
  const patches = collectTestHostPatches(root);
  const collector = patches.filter(
    (patch) => (patch as { id?: string }).id === "collector-admission-value-map-main",
  );
  assert.equal(collector.length, 1);
  assert.equal((collector[0] as { modId?: string }).modId, "example.collector-element");
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

test("buildPatchedDistSources applies collector admission once when both samples are present", (t) => {
  const distDir = extractedDistDir();
  if (!distDir) {
    t.skip("No extracted sandustry dist. Run npm run setup.");
    return;
  }
  const patches = collectTestHostPatches(BUILT_MODS);
  const collectorPatches = patches.filter((patch) =>
    String((patch as { id?: string }).id ?? "").startsWith("collector-admission-value-map"),
  );
  if (collectorPatches.length === 0) {
    t.skip("Build collector-element / collector-patches first.");
    return;
  }
  assert.equal(collectorPatches.length, 3);
  const patched = buildPatchedDistSources(distDir, { modsDir: BUILT_MODS, patches });
  const bundle = patched.get("js/bundle.js");
  assert.ok(
    bundle?.includes("collector.getValueFromElementType(e,t.type)>0"),
    "collector admission patch missing from served bundle",
  );
});
