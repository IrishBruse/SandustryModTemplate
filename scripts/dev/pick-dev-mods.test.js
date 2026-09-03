import assert from "node:assert/strict";
import test from "node:test";
import { resolveWatchModArgs, selectionToModArgs } from "../dev/pick-dev-mods.js";
import { parseEnvText, resolveDevModsSetting, watchModFolders } from "../lib/env.js";

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

test("parseEnvText keeps inline option comments out of values", () => {
  const parsed = parseEnvText(`
# comment
DEV_MODS=all # all | selection | a,b
DEV_CLEANUP=false # false keep | true remove
SANDUSTRY="/path/with # hash"
EMPTY=
`);
  assert.equal(parsed.DEV_MODS, "all");
  assert.equal(parsed.DEV_CLEANUP, "false");
  assert.equal(parsed.SANDUSTRY, "/path/with # hash");
  assert.equal(parsed.EMPTY, "");
});

test("resolveDevModsSetting modes", () => {
  assert.deepEqual(resolveDevModsSetting("all"), { mode: "all", alwaysFolders: [] });
  assert.deepEqual(resolveDevModsSetting("selection"), { mode: "selection", alwaysFolders: [] });
  assert.deepEqual(resolveDevModsSetting("template, trees"), {
    mode: "always",
    alwaysFolders: ["template", "trees"],
  });
});

test("watchModFolders merges always folders with selection", () => {
  const valid = new Set(["template", "trees", "irishbruse.pick-block"]);
  const setting = {
    mode: /** @type {const} */ ("always"),
    alwaysFolders: ["irishbruse.pick-block", "missing"],
  };
  assert.deepEqual(
    watchModFolders({ all: false, folders: ["template"] }, setting, valid),
    ["irishbruse.pick-block", "template"],
  );
});

test("watchModFolders selection-only ignores always list", () => {
  assert.deepEqual(
    watchModFolders(
      { all: false, folders: ["template"] },
      { mode: "selection", alwaysFolders: [] },
      new Set(["template", "trees"]),
    ),
    ["template"],
  );
});

test("resolveWatchModArgs merges for DEV_MODS list", () => {
  const prev = process.env.DEV_MODS;
  process.env.DEV_MODS = "irishbruse.pick-block";
  try {
    assert.deepEqual(
      resolveWatchModArgs({ all: false, folders: ["template"] }, new Set(["template", "irishbruse.pick-block"])),
      ["--mod", "irishbruse.pick-block", "--mod", "template"],
    );
  } finally {
    if (prev === undefined) delete process.env.DEV_MODS;
    else process.env.DEV_MODS = prev;
  }
});
