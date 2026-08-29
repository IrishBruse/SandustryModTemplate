import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { sandkitHostForMod, type SandkitHost } from "./host.ts";
import {
  SANDKIT_LOADER_PREFIX,
  SANDKIT_LOADER_SUFFIX,
  hotEvalMain,
  hotSourceUrl,
  stripSourceUrl,
  wrapHotSource,
  wrapSource,
} from "./hot-eval.ts";

const TEMPLATE_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "template");
const TEMPLATE_MAIN = readFileSync(join(TEMPLATE_DIR, "main.ts"), "utf8");

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

test("wrapHotSource strips the first-load sourceURL and appends a unique hot URL", () => {
  const source = "console.log(1);\n//# sourceURL=sandkit-workshop://author.template/main.js\n";
  assert.equal(stripSourceUrl(source), "console.log(1);\n");
  const body = wrapHotSource(source, "author.template", 9);
  assert.equal(body.includes("//# sourceURL=sandkit-workshop://author.template/main.js\n"), false);
  assert.ok(body.startsWith(SANDKIT_LOADER_PREFIX));
  assert.ok(body.endsWith(`//# sourceURL=${hotSourceUrl("author.template", 9)}\n`));
});

test("wrapHotSource keeps the inline source map (loader line offset stays valid)", () => {
  const mapLine = "//# sourceMappingURL=data:application/json;base64,e30=";
  const source = `console.log(1);\n${mapLine}\n//# sourceURL=sandkit-workshop://author.template/main.js\n`;
  const body = wrapHotSource(source, "author.template", 9);
  assert.ok(body.includes(mapLine));
  assert.equal(body.includes("//# sourceURL=sandkit-workshop://author.template/main.js\n"), false);
});

test("template source keeps a load toast", () => {
  assert.ok(TEMPLATE_MAIN.includes('api.ui.toast("Template loaded", {})'));
});

/**
 * Synthetic source with inject, hotbar, and binding so hotEvalMain disposal
 * stays covered after the starter template was simplified.
 */
const TEMPLATE_SOURCE = `
const api = sandkit.api;
api.ui.toast("Template loaded", {});
api.ui.inject("author.template", function TemplateOverlay() { return "Template inject"; });
api.ui.overlays.register("hotbar", "author.template", function () { return "Template hotbar"; });
api.ui.regions.mount("hotbar", "author.template", { render: function () { return "Template region"; } });
api.input.registerBinding("author.template.ping", ["F13"], {
  displayName: "Template ping",
  category: "Template",
  handlers: {
    down: function () {
      api.ui.toast("Template ping", {});
    },
  },
});
`;

function gameLikeHost(seen: unknown[]) {
  const overlays = Object.freeze({
    register: (slot: string, id: string) => {
      seen.push(`reg:${slot}:${id}`);
    },
    unregister: (slot: string, id: string) => {
      seen.push(`unreg:${slot}:${id}`);
    },
  });
  const ui = Object.freeze({
    toast: (message: unknown, options: unknown) => {
      seen.push(["toast", message, options]);
    },
    inject: (id: string) => {
      seen.push(`inject:${id}`);
      return () => seen.push(`dispose:${id}`);
    },
    overlays,
    regions: Object.freeze({
      mount: (regionId: string, mountId: string) => {
        seen.push(`mount:${regionId}:${mountId}`);
        return {
          update: () => {},
          unmount: () => {
            seen.push(`unmount:${regionId}:${mountId}`);
          },
        };
      },
    }),
  });
  const input = Object.freeze({
    registerBinding: (id: string) => {
      seen.push(`bind:${id}`);
      return id;
    },
  });
  const api = Object.freeze({ ui, input });
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
  }) as { api: typeof api };
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
  const host = gameLikeHost(seen);
  const hostApi = host.api;
  const g1 = await hotEvalMain("author.template", TEMPLATE_SOURCE, host);
  assert.deepEqual(seen, [
    ["toast", `Template loaded (author.template v${g1})`, {}],
    "inject:author.template",
    "reg:hotbar:author.template",
    "mount:hotbar:author.template",
    "bind:author.template.ping",
  ]);
  assert.equal(Object.isFrozen(host.api), true);
  assert.equal(host.api, hostApi);
  const g2 = await hotEvalMain("author.template", TEMPLATE_SOURCE, host);
  assert.equal(g2, g1 + 1);
  assert.deepEqual(seen, [
    ["toast", `Template loaded (author.template v${g1})`, {}],
    "inject:author.template",
    "reg:hotbar:author.template",
    "mount:hotbar:author.template",
    "bind:author.template.ping",
    "dispose:author.template",
    "unreg:hotbar:author.template",
    "unmount:hotbar:author.template",
    ["toast", `Template loaded (author.template v${g2})`, {}],
    "inject:author.template",
    "reg:hotbar:author.template",
    "mount:hotbar:author.template",
    "bind:author.template.ping",
  ]);
});

/** Same calls as examples/ui/overlay-hotkey (inject) and overlays.register. */
const OVERLAY_SOURCE = `
sandkit.api.ui.inject("overlay-hotkey", function Overlay() { return null; });
sandkit.api.ui.overlays.register("hotbar", "overlay-hotkey", function OverlayHotbar() { return null; });
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

type OverlayBag = Record<string, Record<string, { render: () => unknown }>>;

/** Same overlay map as `session.ui.overlays` in the live engine. */
function gameOverlayHost(modId: string): { overlays: OverlayBag; host: SandkitHost } {
  const overlays: OverlayBag = {};
  const register = (slot: string, id: string, render?: () => unknown) => {
    if (!overlays[slot]) overlays[slot] = {};
    overlays[slot][id] = { render: render ?? (() => null) };
  };
  const unregister = (slot: string, id: string) => {
    delete overlays[slot]?.[id];
  };
  const inject = (componentId: string, component: () => unknown) => {
    const n = `${modId}:${componentId}`;
    register("global", n, () => component());
    return () => unregister("global", n);
  };
  return {
    overlays,
    host: {
      api: {
        ui: {
          inject,
          overlays: { register, unregister },
          toast: () => {},
        },
      },
    },
  };
}

const INJECT_V1 = `
sandkit.api.ui.inject("author.template", function TemplateOverlay() { return "Template inject v1"; });
sandkit.api.ui.overlays.register("hotbar", "author.template", function () { return "Template hotbar v1"; });
`;

const INJECT_V2 = `
sandkit.api.ui.inject("author.template", function TemplateOverlay() { return "Template inject v2"; });
sandkit.api.ui.overlays.register("hotbar", "author.template", function () { return "Template hotbar v2"; });
`;

test("hotEvalMain replaces overlay render by slot id on the target host", async () => {
  const template = gameOverlayHost("author.template");
  await hotEvalMain("author.template", INJECT_V1, template.host);
  assert.equal(
    template.overlays.global["author.template:author.template"]?.render(),
    "Template inject v1",
  );
  assert.equal(template.overlays.hotbar["author.template"]?.render(), "Template hotbar v1");
  await hotEvalMain("author.template", INJECT_V2, template.host);
  assert.equal(
    template.overlays.global["author.template:author.template"]?.render(),
    "Template inject v2",
  );
  assert.equal(template.overlays.hotbar["author.template"]?.render(), "Template hotbar v2");
  assert.deepEqual(Object.keys(template.overlays.global), ["author.template:author.template"]);
  assert.deepEqual(Object.keys(template.overlays.hotbar), ["author.template"]);
});

test("hotEvalMain keeps the host inject prefix; companion host would mint dev-tools ids", async () => {
  const template = gameOverlayHost("author.template");
  const companion = gameOverlayHost("dev-tools");
  await hotEvalMain("author.template", INJECT_V1, template.host);
  assert.ok(template.overlays.global["author.template:author.template"]);
  assert.equal(companion.overlays.global?.["dev-tools:author.template"], undefined);

  await hotEvalMain("author.template", INJECT_V1, companion.host);
  assert.ok(companion.overlays.global["dev-tools:author.template"]);
  assert.equal(template.overlays.global["dev-tools:author.template"], undefined);
});

test("sandkitHostForMod reads the stashed host and skips a missing id", () => {
  const target: SandkitHost = { api: { n: 1 } };
  const globals = { __sandkitByMod: { "author.template": target } } as unknown as typeof globalThis;
  assert.equal(sandkitHostForMod("author.template", globals), target);
  assert.equal(sandkitHostForMod("dev-tools", globals), null);
  assert.equal(sandkitHostForMod("author.template", {} as typeof globalThis), null);
});
