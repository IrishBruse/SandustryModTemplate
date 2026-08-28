import assert from "node:assert/strict";
import test from "node:test";
import { companionSettings } from "./mods.ts";

test("companionSettings only enables listed mods", () => {
  const settings = companionSettings(["author.template"]) as {
    externalModSettings: Record<string, { enabled?: boolean; watchLocalMods?: boolean }>;
  };
  assert.equal(settings.externalModSettings["author.template"]?.enabled, true);
  assert.equal(settings.externalModSettings["hot-reload"], undefined);
});

test("companionSettings leaves hooks-intercept off", () => {
  const settings = companionSettings(["example.hooks-intercept", "author.template"]) as {
    externalModSettings: Record<string, { enabled?: boolean }>;
  };
  assert.equal(settings.externalModSettings["example.hooks-intercept"]?.enabled, false);
  assert.equal(settings.externalModSettings["author.template"]?.enabled, true);
});
