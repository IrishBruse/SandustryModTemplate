import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SETTING_DEFAULTS } from "./setting-defaults.ts";

const DEV_TOOLS_DIR = dirname(dirname(fileURLToPath(import.meta.url)));

test("SETTING_DEFAULTS matches boolean configSchema defaults in modinfo.json", () => {
  const manifest = JSON.parse(readFileSync(join(DEV_TOOLS_DIR, "modinfo.json"), "utf8")) as {
    configSchema?: Record<string, { type?: string; default?: unknown }>;
  };
  for (const [key, value] of Object.entries(SETTING_DEFAULTS)) {
    const field = manifest.configSchema?.[key];
    assert.equal(field?.type, "boolean", `${key} must be a boolean schema field`);
    assert.equal(field?.default, value, `${key} default`);
  }
});
