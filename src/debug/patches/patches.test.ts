import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, "../../..");
const RUNTIME_CANDIDATES = [
  join(ROOT, "sandustry/dist/js/external-mod-runtime.js"),
  join(ROOT, "sandustry/js/external-mod-runtime.js"),
];

function extractFinds(source: string): string[] {
  const names = ["COMPILE_FIND", "EXECUTE_FIND", "INJECT_FIND"];
  return names.map((name) => {
    const match = source.match(
      new RegExp(`const ${name} =\\n  ('(?:\\\\'|[^'])*'|"(?:\\\\"|[^"])*");`),
    );
    if (!match) throw new Error(`missing ${name} in patches.ts`);
    return eval(match[1]) as string;
  });
}

test("loader patch finds match extracted external-mod-runtime.js", (t) => {
  const runtimePath = RUNTIME_CANDIDATES.find((path) => existsSync(path));
  if (!runtimePath) {
    t.skip("extracted game JS missing — run npm run setup");
    return;
  }
  const runtime = readFileSync(runtimePath, "utf8");
  const finds = extractFinds(readFileSync(join(DIR, "patches.ts"), "utf8"));
  for (const find of finds) {
    const count = runtime.split(find).length - 1;
    assert.equal(count, 1, `expected 1 match, got ${count}: ${find.slice(0, 80)}`);
  }
});
