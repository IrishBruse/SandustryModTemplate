import assert from "node:assert/strict";
import test from "node:test";
import { disposeLists, runDisposers } from "./dispose.ts";
import { copyOwn, trackDisposeReturn, wrapApi, wrapRegionsMount, wrapSandkit } from "./wrap-api.ts";

test("copyOwn does not proxy the host and leaves it unchanged", () => {
  const host = { api: { n: 1 } };
  const copy = copyOwn(host);
  copy.api = { n: 2 };
  assert.equal(host.api.n, 1);
  assert.equal(copy.api.n, 2);
  assert.equal(Object.getPrototypeOf(copy), Object.getPrototypeOf(host));
});

test("trackDisposeReturn records function returns for that mod", () => {
  const stop = () => {};
  const wrapped = trackDisposeReturn(() => stop, "mod-a");
  wrapped();
  assert.equal(disposeLists()["mod-a"]?.length, 1);
  runDisposers("mod-a");
});

test("wrapApi does not log intercepted calls", () => {
  const lines: unknown[][] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args);
  };
  try {
    const host = {
      api: {
        ui: {
          inject: () => () => {},
          toast: (message: unknown) => message,
        },
        events: { on: () => () => {} },
        hooks: { intercept: () => () => {}, modify: () => () => {} },
      },
    };
    const wrapped = wrapSandkit(host, "mod-log", 2);
    wrapped.api.ui.inject("mod-log", function Overlay() {
      return null;
    });
    wrapped.api.events.on("tick", () => {});
    wrapped.api.hooks.intercept("x", () => {});
    wrapped.api.ui.toast("hi");

    assert.equal(lines.length, 0);
  } finally {
    console.log = original;
    runDisposers("mod-log");
  }
});

test("wrapApi tracks inject and on; toast stays plain", () => {
  const host = {
    api: {
      toast: () => "no",
      ui: {
        inject: () => () => {},
        toast: (message: unknown) => message,
      },
      events: {
        on: () => () => {},
      },
    },
  };
  const wrapped = wrapSandkit(host, "mod-b");
  assert.notEqual(wrapped, host);
  wrapped.api.ui.inject();
  wrapped.api.events.on();
  assert.equal(wrapped.api.ui.toast("plain"), "plain");
  assert.equal(disposeLists()["mod-b"]?.length, 2);
  runDisposers("mod-b");

  const hot = wrapSandkit(host, "mod-b");
  assert.equal(hot.api.ui.toast("Template loaded"), "Template loaded");
});

test("wrapApi unregisters overlays.register on reload", () => {
  const seen: string[] = [];
  const overlays = Object.freeze({
    register: (slot: string, id: string) => {
      seen.push(`reg:${slot}:${id}`);
    },
    unregister: (slot: string, id: string) => {
      seen.push(`unreg:${slot}:${id}`);
    },
    update: () => {},
  });
  const api = wrapApi({ ui: { overlays } }, "mod-ov");
  assert.notEqual(api.ui?.overlays, overlays);
  const register = (
    api.ui?.overlays as { register: (s: string, i: string, r: () => null) => void } | undefined
  )?.register;
  assert.ok(register);
  register("hotbar", "overlay-hotkey", () => null);
  assert.deepEqual(seen, ["reg:hotbar:overlay-hotkey"]);
  runDisposers("mod-ov");
  assert.deepEqual(seen, ["reg:hotbar:overlay-hotkey", "unreg:hotbar:overlay-hotkey"]);
});

test("wrapApi calls mount and runDisposers calls unmount on the handle", () => {
  const seen: string[] = [];
  const regions = Object.freeze({
    mount: (regionId: string, mountId: string) => {
      seen.push(`mount:${regionId}:${mountId}`);
      return {
        update: () => {},
        unmount: () => {
          seen.push(`unmount:${regionId}:${mountId}`);
        },
      };
    },
    setVisible: () => {},
  });
  const api = wrapApi({ ui: { regions } }, "mod-rg");
  assert.notEqual(api.ui?.regions, regions);
  const mount = (
    api.ui?.regions as
      | { mount: (regionId: string, mountId: string, options?: object) => unknown }
      | undefined
  )?.mount;
  assert.ok(mount);
  mount("hotbar", "author.template", { render: () => null });
  assert.deepEqual(seen, ["mount:hotbar:author.template"]);
  runDisposers("mod-rg");
  assert.deepEqual(seen, ["mount:hotbar:author.template", "unmount:hotbar:author.template"]);
});

test("wrapRegionsMount tracks function return from mount", () => {
  const stop = () => {};
  const regions = { mount: () => stop };
  const wrapped = wrapRegionsMount(regions, "mod-fn");
  wrapped.mount();
  assert.equal(disposeLists()["mod-fn"]?.length, 1);
  runDisposers("mod-fn");
});

test("wrapApi gates registerBinding handlers after dispose", () => {
  const downs: string[] = [];
  let stored: (() => void) | undefined;
  const wrapped = wrapSandkit(
    {
      api: {
        input: {
          registerBinding: (
            _id: string,
            _keys: string[],
            def: { handlers: { down: () => void }; [key: string]: unknown },
          ) => {
            stored = def.handlers.down;
            return _id;
          },
        },
      },
    },
    "mod-in",
  );
  const id = wrapped.api.input.registerBinding("author.input.toast", ["KeyT"], {
    displayName: "Show toast",
    category: "Input",
    handlers: {
      down: () => downs.push("a"),
    },
  });
  assert.equal(id, "author.input.toast");
  stored?.();
  assert.deepEqual(downs, ["a"]);
  runDisposers("mod-in");
  stored?.();
  assert.deepEqual(downs, ["a"]);
});

function frozenApiHost(api: object) {
  const target = {};
  Object.defineProperty(target, "api", {
    value: api,
    writable: false,
    configurable: false,
    enumerable: true,
  });
  return target as { api: typeof api };
}

test("Proxy get that replaces api throws; wrapSandkit uses a plain copy", () => {
  const api = Object.freeze({ n: 1 });
  const target = frozenApiHost(api);
  const replaced = { n: 2 };
  const bad = new Proxy(target, {
    get(t, p) {
      if (p === "api") return replaced;
      return Reflect.get(t, p);
    },
  });
  assert.throws(() => bad.api, /non-configurable/);

  const host = new Proxy(target, {
    get(t, p, r) {
      return Reflect.get(t, p, r);
    },
  }) as { api: { n: number } };
  const wrapped = wrapSandkit(host, "mod-p");
  assert.notEqual(wrapped, host);
  assert.equal(host.api, api);
  assert.notEqual(wrapped.api, api);
  assert.equal((wrapped.api as { n: number }).n, 1);
});

test("wrapApi copies frozen events onto a new object", () => {
  const events = Object.freeze({
    on: () => () => {},
    emit: () => {},
  });
  const api = wrapApi({ events }, "mod-c");
  assert.notEqual(api.events, events);
  (api.events as { on: () => () => void }).on();
  assert.equal(disposeLists()["mod-c"]?.length, 1);
  runDisposers("mod-c");
});
