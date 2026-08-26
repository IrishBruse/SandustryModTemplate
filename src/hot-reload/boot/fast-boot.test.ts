import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTO_LOAD_SESSION_KEY,
  autoLoadSessionDone,
  markAutoLoadSessionDone,
} from "./auto-load.ts";

function mockStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

test("autoLoadSessionDone honours legacy session key", () => {
  const session = mockStorage();
  const originalSession = globalThis.sessionStorage;
  Object.defineProperty(globalThis, "sessionStorage", { value: session, configurable: true });
  try {
    assert.equal(autoLoadSessionDone(), false);
    session.setItem("irishbruse.debug:autoLoadDone", "1");
    assert.equal(autoLoadSessionDone(), true);
    session.clear();
    markAutoLoadSessionDone();
    assert.equal(session.getItem(AUTO_LOAD_SESSION_KEY), "1");
  } finally {
    Object.defineProperty(globalThis, "sessionStorage", {
      value: originalSession,
      configurable: true,
    });
  }
});
