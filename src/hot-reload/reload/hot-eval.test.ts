import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  SANDKIT_LOADER_PREFIX,
  SANDKIT_LOADER_SUFFIX,
  hotEvalMain,
  wrapSource,
} from "./hot-eval.ts";

const TEMPLATE_MAIN = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "..", "template", "main.ts"),
  "utf8",
);

test("wrapSource matches the sandkit loader body (5 lines before source)", () => {
  const source = "console.log(1);";
  const body = wrapSource(source);
  assert.equal(body, `${SANDKIT_LOADER_PREFIX}${source}${SANDKIT_LOADER_SUFFIX}`);
  assert.equal(
    SANDKIT_LOADER_PREFIX,
    '"use strict";\nconst sandkit = __sandkit;\nreturn (async () => {\n',
  );
  assert.equal(SANDKIT_LOADER_PREFIX.split("\n").length - 1, 3);
  assert.ok(body.startsWith('"use strict";\n'));
});

/** Same statements as `src/template/main.ts`. */
const TEMPLATE_SOURCE = TEMPLATE_MAIN;

function gameLikeHost(toast: (...args: unknown[]) => void) {
  const ui = Object.freeze({ toast });
  const api = Object.freeze({ ui });
  const target = {};
  Object.defineProperty(target, "api", {
    value: api,
    writable: false,
    configurable: false,
    enumerable: true,
  });
  return new Proxy(target, {
    get(t, p, r) {
      return Reflect.get(t, p, r);
    },
  }) as { api: { ui: { toast: typeof toast } } };
}

test("hotEvalMain evals with wrapped sandkit and runs prior disposers", async () => {
  const seen: unknown[] = [];
  const host = {
    api: {
      ui: {
        inject: () => {
          seen.push("inject");
          return () => seen.push("dispose");
        },
      },
    },
  };
  await hotEvalMain("mod-e", "sandkit.api.ui.inject();", host);
  assert.deepEqual(seen, ["inject"]);
  await hotEvalMain("mod-e", "void 0;", host);
  assert.deepEqual(seen, ["inject", "dispose"]);
});

test("hotEvalMain runs the template source on a frozen proxied sandkit", async () => {
  const seen: unknown[] = [];
  const host = gameLikeHost((message, options) => {
    seen.push([message, options]);
  });
  await hotEvalMain("author.template", TEMPLATE_SOURCE, host);
  assert.deepEqual(seen, [["Template loaded", {}]]);
  assert.equal(Object.isFrozen(host.api), true);
});

/** Same calls as examples/ui/overlay-hotkey (inject) and overlays.register. */
const OVERLAY_SOURCE = `
sandkit.api.ui.inject("overlay-hotkey", function Overlay() { return null; });
sandkit.api.ui.overlays.register("hotbar", "overlay-hotkey", function () { return null; });
`;

test("hotEvalMain disposes ui.inject and overlays.register before the next eval", async () => {
  const seen: string[] = [];
  const host = {
    api: {
      ui: {
        inject: (id: string) => {
          seen.push(`inject:${id}`);
          return () => seen.push(`dispose:${id}`);
        },
        overlays: {
          register: (slot: string, id: string) => {
            seen.push(`reg:${slot}:${id}`);
          },
          unregister: (slot: string, id: string) => {
            seen.push(`unreg:${slot}:${id}`);
          },
        },
      },
    },
  };
  await hotEvalMain("overlay-hotkey", OVERLAY_SOURCE, host);
  await hotEvalMain("overlay-hotkey", OVERLAY_SOURCE, host);
  assert.deepEqual(seen, [
    "inject:overlay-hotkey",
    "reg:hotbar:overlay-hotkey",
    "dispose:overlay-hotkey",
    "unreg:hotbar:overlay-hotkey",
    "inject:overlay-hotkey",
    "reg:hotbar:overlay-hotkey",
  ]);
});

/** Same shape as examples/ui/input-binding registerBinding. */
const BINDING_SOURCE = `
sandkit.api.input.registerBinding("author.input-binding-example.toast", ["KeyT"], {
  displayName: "Show toast",
  category: "Input Binding",
  handlers: { down: function () { sandkit.api._downs.push(1); } },
});
`;

test("hotEvalMain stops prior registerBinding handlers after reload", async () => {
  const downs: number[] = [];
  const stored: Array<() => void> = [];
  const host = {
    api: {
      _downs: downs,
      input: {
        registerBinding: (
          _id: string,
          _keys: string[],
          def: { handlers: { down: () => void } },
        ) => {
          stored.push(def.handlers.down);
          return _id;
        },
      },
    },
  };
  await hotEvalMain("input-binding", BINDING_SOURCE, host);
  stored[0]?.();
  await hotEvalMain("input-binding", BINDING_SOURCE, host);
  stored[0]?.();
  stored[1]?.();
  assert.deepEqual(downs, [1, 1]);
});
