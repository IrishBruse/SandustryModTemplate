import assert from "node:assert/strict";
import test from "node:test";
import { disposeLists, runDisposers } from "./dispose.ts";
import { copyOwn, trackDisposeReturn, wrapApi, wrapSandkit } from "./wrap-api.ts";

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

test("wrapApi tracks inject and on, not toast", () => {
  const host = {
    api: {
      toast: () => "no",
      ui: {
        inject: () => () => {},
        toast: () => {},
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
  wrapped.api.ui.toast();
  assert.equal(disposeLists()["mod-b"]?.length, 2);
  runDisposers("mod-b");
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
