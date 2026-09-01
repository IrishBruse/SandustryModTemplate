import assert from "node:assert/strict";
import test from "node:test";
import { selectionToModArgs } from "../dev/pick-dev-mods.js";

test("selectionToModArgs is empty for all mods", () => {
  assert.deepEqual(selectionToModArgs(null), []);
  assert.deepEqual(selectionToModArgs({ all: true }), []);
});

test("selectionToModArgs expands folders", () => {
  assert.deepEqual(selectionToModArgs({ all: false, folders: ["template", "trees"] }), [
    "--mod",
    "template",
    "--mod",
    "trees",
  ]);
});
