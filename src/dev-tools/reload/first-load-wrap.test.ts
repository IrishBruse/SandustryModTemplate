import assert from "node:assert/strict";
import test from "node:test";
import {
  bootstrapApiWrapIife,
  DEV_TOOLS_WRAP_SANDKIT_KEY,
  installFirstLoadApiWrap,
} from "./first-load-wrap.ts";
import { disposeLists, runDisposers } from "./dispose.ts";

test("installFirstLoadApiWrap skips self and wraps other mods", () => {
  const lines: unknown[][] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args);
  };
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
    assert.deepEqual(lines[0], ["author.template api.ui.inject"]);
  } finally {
    console.log = original;
    runDisposers("author.template");
    delete (globalThis as Record<string, unknown>)[DEV_TOOLS_WRAP_SANDKIT_KEY];
    assert.equal(disposeLists()["author.template"]?.length ?? 0, 0);
  }
});

test("bootstrapApiWrapIife wraps hot-reload APIs only", () => {
  const lines: unknown[][] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args);
  };
  try {
    delete (globalThis as Record<string, unknown>)[DEV_TOOLS_WRAP_SANDKIT_KEY];
    new Function(bootstrapApiWrapIife())();
    const wrap = (
      globalThis as typeof globalThis & {
        [DEV_TOOLS_WRAP_SANDKIT_KEY]?: (
          modId: string,
          host: { api: object },
        ) => {
          api: {
            elements?: { register?: (...a: unknown[]) => unknown };
            ui?: { inject?: (...a: unknown[]) => unknown };
          };
        };
      }
    )[DEV_TOOLS_WRAP_SANDKIT_KEY];
    assert.equal(typeof wrap, "function");
    const raw = {
      api: {
        elements: { register: (id: string) => id },
        ui: { inject: () => "ok" },
      },
    };
    assert.equal(wrap!("dev-tools", raw), raw);
    const wrapped = wrap!("author.template", raw);
    // Hot-reload path is wrapped; content register is left alone.
    assert.equal(wrapped.api.elements?.register, raw.api.elements.register);
    assert.equal(wrapped.api.ui?.inject?.(), "ok");
    assert.equal(lines[0]?.[0], "author.template api.ui.inject");
  } finally {
    console.log = original;
    delete (globalThis as Record<string, unknown>)[DEV_TOOLS_WRAP_SANDKIT_KEY];
  }
});
