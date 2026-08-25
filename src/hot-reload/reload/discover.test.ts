import assert from "node:assert/strict";
import test from "node:test";
import {
  collectModIds,
  discoverLocalMods,
  modsStateFromStore,
  rewriteMainUrl,
} from "./discover.ts";

test("collectModIds skips the companion id and dedupes", () => {
  assert.deepEqual(
    collectModIds(
      [
        { id: "hot-reload" },
        { id: "author.template" },
        { modId: "author.template" },
        "events-example",
      ],
      "hot-reload",
    ),
    ["author.template", "events-example"],
  );
});

test("collectModIds reads object maps keyed by id", () => {
  assert.deepEqual(
    collectModIds({ "author.template": { id: "author.template" }, "hot-reload": {} }, "hot-reload"),
    ["author.template"],
  );
});

test("rewriteMainUrl swaps workshop and file paths", () => {
  assert.equal(
    rewriteMainUrl("sandkit-workshop://hot-reload/main.js", "hot-reload", "author.template"),
    "sandkit-workshop://author.template/main.js",
  );
  assert.equal(
    rewriteMainUrl(
      "file:///home/me/.config/sandustry/mods/hot-reload/main.js",
      "hot-reload",
      "author.template",
    ),
    "file:///home/me/.config/sandustry/mods/author.template/main.js",
  );
  assert.equal(
    rewriteMainUrl(
      "file:///C:/Users/me/AppData/Roaming/sandustry/mods/hot-reload/main.js",
      "hot-reload",
      "a",
    ),
    "file:///C:/Users/me/AppData/Roaming/sandustry/mods/a/main.js",
  );
});

test("rewriteMainUrl falls back to workshop protocol", () => {
  assert.equal(
    rewriteMainUrl("blob:unknown", "hot-reload", "author.template"),
    "sandkit-workshop://author.template/main.js",
  );
});

test("discoverLocalMods skips self", () => {
  const mods = discoverLocalMods("hot-reload", "sandkit-workshop://hot-reload/main.js", [
    { id: "hot-reload" },
    { id: "author.template" },
  ]);
  assert.deepEqual(mods, [
    { id: "author.template", mainUrl: "sandkit-workshop://author.template/main.js" },
  ]);
});

test("modsStateFromStore reads __sandkitExternalRuntimeV1.order", () => {
  const order = [{ id: "hot-reload" }, { id: "author.template", version: "0.0.1" }];
  assert.deepEqual(
    modsStateFromStore({
      items: {},
      __sandkitExternalRuntimeV1: { version: 1, order },
    }),
    order,
  );
  assert.equal(modsStateFromStore({ items: {} }), undefined);
});
