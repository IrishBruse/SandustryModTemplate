import assert from "node:assert/strict";
import test from "node:test";
import { DEV_TOOLS_WRAP_SANDKIT_KEY, installFirstLoadApiWrap } from "./first-load-wrap.ts";
import { disposeLists, runDisposers } from "./dispose.ts";

test("installFirstLoadApiWrap skips self and wraps other mods", () => {
  try {
    installFirstLoadApiWrap("dev-tools");
    const wrap = (
      globalThis as typeof globalThis & {
        [DEV_TOOLS_WRAP_SANDKIT_KEY]?: (
          modId: string,
          host: { api: object },
        ) => { api: { ui?: { inject?: () => () => void } } };
      }
    )[DEV_TOOLS_WRAP_SANDKIT_KEY];
    assert.ok(wrap);

    const raw = {
      api: {
        ui: {
          inject: () => () => {},
        },
      },
    };
    assert.equal(wrap("dev-tools", raw), raw);

    const wrapped = wrap("author.template", raw);
    assert.notEqual(wrapped, raw);
    wrapped.api.ui?.inject?.();
    assert.equal(disposeLists()["author.template"]?.length, 1);
  } finally {
    runDisposers("author.template");
    delete (globalThis as Record<string, unknown>)[DEV_TOOLS_WRAP_SANDKIT_KEY];
    assert.equal(disposeLists()["author.template"]?.length ?? 0, 0);
  }
});
