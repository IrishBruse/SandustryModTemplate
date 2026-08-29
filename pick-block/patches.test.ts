import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { patches } from "./patches.ts";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const BUNDLE = join(ROOT, "sandustry/0.5.5-mods/dist/js/bundle.js");
const WORKSHOP = join(ROOT, "sandustry/workshop-mods.js");

test("patches keep extracted bundle.js parseable", { skip: !existsSync(BUNDLE) }, () => {
  const require = createRequire(import.meta.url);
  const { applyPatchSet } = require(WORKSHOP) as {
    applyPatchSet: (
      sources: Map<string, string>,
      patches: unknown[],
    ) => { sources: Map<string, string>; results: { applied: boolean; patch: { id: string } }[] };
  };
  const bundlePatches = patches.filter((patch) => patch.file === "js/bundle.js");
  const { sources, results } = applyPatchSet(
    new Map([["js/bundle.js", readFileSync(BUNDLE, "utf8")]]),
    bundlePatches,
  );
  for (const result of results) {
    assert.equal(result.applied, true, result.patch.id);
  }
  new vm.Script(sources.get("js/bundle.js") ?? "", { filename: "js/bundle.js" });
});
