import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SETTING_DEFAULTS } from "./setting-defaults.ts";

const BOOT_DIR = dirname(fileURLToPath(import.meta.url));

function booleanSchemaDefault(source: string, key: string): boolean {
  const match = source.match(
    new RegExp(`${key}:\\s*\\{[\\s\\S]*?type:\\s*"boolean",[\\s\\S]*?default:\\s*(true|false)`),
  );
  assert.ok(match, `boolean schema default for ${key}`);
  return match[1] === "true";
}

test("SETTING_DEFAULTS matches boolean configSchema defaults in modinfo.ts", () => {
  const source = readFileSync(join(BOOT_DIR, "..", "modinfo.ts"), "utf8");
  for (const [key, value] of Object.entries(SETTING_DEFAULTS)) {
    assert.equal(booleanSchemaDefault(source, key), value, key);
  }
});
