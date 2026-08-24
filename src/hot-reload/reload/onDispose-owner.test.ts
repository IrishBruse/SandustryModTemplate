import assert from "node:assert/strict";
import { test } from "node:test";

const ACTIVE_KEY = "__sandkitHotReloadActive__";
const DISPOSE_LISTS_KEY = "__sandkitDisposeLists__";

type DisposeGlobals = {
  [ACTIVE_KEY]?: string;
  [DISPOSE_LISTS_KEY]?: Record<string, Array<() => void>>;
};

const g = globalThis as typeof globalThis & DisposeGlobals;
g[ACTIVE_KEY] = "owner.mod";
g[DISPOSE_LISTS_KEY] = {};

test("onDispose binds to the active mod id from module init, not a later overwrite", async () => {
  const { onDispose } = await import("../../../modkit/internal/debug/index.ts");

  g[ACTIVE_KEY] = "other.mod";
  onDispose(() => {});

  assert.equal(g[DISPOSE_LISTS_KEY]?.["owner.mod"]?.length, 1);
  assert.equal(g[DISPOSE_LISTS_KEY]?.["other.mod"], undefined);
});

test("wrap-tracked disposers bind to the eval mod id, not a later overwrite", async () => {
  g[DISPOSE_LISTS_KEY] = {};
  const { wrapForDispose } = await import("./wrap-sandkit.ts");
  const stop = () => {};
  const sk = {
    api: {
      events: { on: () => stop },
      ui: { overlays: { unregister: () => {} } },
    },
    enums: { Scene: { Game: 1 } },
    state: {},
  } as unknown as typeof sandkit;
  const wrapped = wrapForDispose(sk, "wrap.owner");
  g[ACTIVE_KEY] = "other.mod";
  wrapped.api.events.on("frame:render", () => {});
  assert.equal(g[DISPOSE_LISTS_KEY]?.["wrap.owner"]?.length, 1);
  assert.equal(g[DISPOSE_LISTS_KEY]?.["other.mod"], undefined);
});
