import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));

test("mod.ts version matches the latest CHANGELOG heading", () => {
  const mod = readFileSync(join(DIR, "mod.ts"), "utf8");
  const changelog = readFileSync(join(DIR, "CHANGELOG.md"), "utf8");
  const version = mod.match(/version:\s*"([^"]+)"/)?.[1];
  assert.ok(version);
  assert.match(changelog, new RegExp(`^## ${version.replaceAll(".", "\\.")}$`, "m"));
});

test("workshop copy mentions the 1 MB GIF cap", () => {
  const text = readFileSync(join(DIR, "workshop/workshop.md"), "utf8");
  assert.match(text, /1 MB GIF cap/i);
});
