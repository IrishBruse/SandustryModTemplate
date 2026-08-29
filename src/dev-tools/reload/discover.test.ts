import assert from "node:assert/strict";
import test from "node:test";
import {
  collectModIds,
  discoverLocalMods,
  isLocalExternalMod,
  modsStateFromStore,
  orderedModsFromSession,
  resolveModsState,
  rewriteMainUrl,
} from "./discover.ts";

test("collectModIds skips the companion id and dedupes", () => {
  assert.deepEqual(
    collectModIds(
      [
        { id: "dev-tools" },
        { id: "author.template" },
        { modId: "author.template" },
        "events-example",
      ],
      "dev-tools",
    ),
    ["author.template", "events-example"],
  );
});

test("collectModIds reads object maps keyed by id", () => {
  assert.deepEqual(
    collectModIds({ "author.template": { id: "author.template" }, "dev-tools": {} }, "dev-tools"),
    ["author.template"],
  );
});

test("rewriteMainUrl swaps workshop and file paths", () => {
  assert.equal(
    rewriteMainUrl("sandkit-workshop://dev-tools/main.js", "dev-tools", "author.template"),
    "sandkit-workshop://author.template/main.js",
  );
  assert.equal(
    rewriteMainUrl(
      "file:///home/me/.config/sandustry/mods/dev-tools/main.js",
      "dev-tools",
      "author.template",
    ),
    "file:///home/me/.config/sandustry/mods/author.template/main.js",
  );
  assert.equal(
    rewriteMainUrl(
      "file:///C:/Users/me/AppData/Roaming/sandustry/mods/dev-tools/main.js",
      "dev-tools",
      "a",
    ),
    "file:///C:/Users/me/AppData/Roaming/sandustry/mods/a/main.js",
  );
});

test("rewriteMainUrl falls back to workshop protocol", () => {
  assert.equal(
    rewriteMainUrl("blob:unknown", "dev-tools", "author.template"),
    "sandkit-workshop://author.template/main.js",
  );
});

test("discoverLocalMods skips self", () => {
  const mods = discoverLocalMods("dev-tools", "sandkit-workshop://dev-tools/main.js", [
    { id: "dev-tools" },
    { id: "author.template" },
  ]);
  assert.deepEqual(mods, [
    { id: "author.template", mainUrl: "sandkit-workshop://author.template/main.js" },
  ]);
});

test("modsStateFromStore reads __sandkitExternalRuntimeV1.order", () => {
  const order = [{ id: "dev-tools" }, { id: "author.template", version: "0.0.1" }];
  assert.deepEqual(
    modsStateFromStore({
      items: {},
      __sandkitExternalRuntimeV1: { version: 1, order },
    }),
    order,
  );
  assert.equal(modsStateFromStore({ items: {} }), undefined);
});

test("isLocalExternalMod requires discoveredVia local", () => {
  assert.equal(
    isLocalExternalMod({
      manifest: { id: "author.template" },
      workshop: { itemId: null, discoveredVia: ["local"] },
    }),
    true,
  );
  assert.equal(
    isLocalExternalMod({
      manifest: { id: "workshop.mod" },
      workshop: { itemId: 1, discoveredVia: ["workshop"] },
    }),
    false,
  );
});

test("discoverLocalMods polls local orderedMods and skips Workshop", () => {
  const mods = discoverLocalMods("dev-tools", "file:///mods/dev-tools/main.js", [
    {
      manifest: { id: "dev-tools" },
      rootUrl: "file:///mods/dev-tools/",
      workshop: { itemId: null, discoveredVia: ["local"] },
    },
    {
      manifest: { id: "author.template" },
      rootUrl: "file:///mods/author.template/",
      workshop: { itemId: null, discoveredVia: ["local"] },
    },
    {
      manifest: { id: "workshop.mod" },
      rootUrl: "sandkit-workshop://workshop.mod/",
      workshop: { itemId: 99, discoveredVia: ["workshop"] },
    },
  ]);
  assert.deepEqual(mods, [
    { id: "author.template", mainUrl: "file:///mods/author.template/main.js" },
  ]);
});

test("discoverLocalMods does not poll Workshop-only orderedMods", () => {
  assert.deepEqual(
    discoverLocalMods("dev-tools", "file:///mods/dev-tools/main.js", [
      {
        manifest: { id: "workshop.mod" },
        rootUrl: "sandkit-workshop://workshop.mod/",
        workshop: { itemId: 99, discoveredVia: ["workshop"] },
      },
    ]),
    [],
  );
});

test("orderedModsFromSession reads session.externalMods.orderedMods", () => {
  const ordered = [{ manifest: { id: "author.template" } }];
  assert.deepEqual(orderedModsFromSession({ externalMods: { orderedMods: ordered } }), ordered);
  assert.equal(orderedModsFromSession({}), undefined);
});

test("resolveModsState does not fall back to Workshop order while orderedMods is missing", () => {
  assert.deepEqual(resolveModsState({ externalMods: {} }), []);
  assert.deepEqual(
    resolveModsState({
      externalMods: { orderedMods: [{ manifest: { id: "author.template" } }] },
    }),
    [{ manifest: { id: "author.template" } }],
  );
  assert.deepEqual(resolveModsState({}), []);
  assert.deepEqual(resolveModsState(undefined), []);
});
