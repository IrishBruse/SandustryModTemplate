import assert from "node:assert/strict";
import test from "node:test";
import { parseModFilters, resolveModRoots, DEFAULT_MOD_ROOTS, MOD_ROOTS } from "./mods.js";

test("parseModFilters reads --mod and --mod=", () => {
  assert.deepEqual(parseModFilters(["--mod", "overlay-hotkey", "--debug"]), ["overlay-hotkey"]);
  assert.deepEqual(parseModFilters(["--mod=template", "--mod", "i18n"]), ["template", "i18n"]);
  assert.deepEqual(parseModFilters(["--examples"]), []);
});

test("resolveModRoots searches src and examples when --mod is set", () => {
  assert.deepEqual(resolveModRoots([]), DEFAULT_MOD_ROOTS);
  assert.deepEqual(resolveModRoots(["--examples"]), ["examples"]);
  assert.deepEqual(resolveModRoots(["--mod", "overlay-hotkey"]), MOD_ROOTS);
  assert.deepEqual(resolveModRoots(["--examples", "--mod", "overlay-hotkey"]), ["examples"]);
});
