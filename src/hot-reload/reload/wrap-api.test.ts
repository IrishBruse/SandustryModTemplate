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
