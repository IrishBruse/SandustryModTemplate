import assert from "node:assert/strict";
import test from "node:test";
import {
  COMPANION_MOD_ID,
  DEBUG_MOD_ID,
  getStorageSaveId,
  START_SAVE_STORAGE_KEY,
} from "./auto-load-save.ts";

test("DEBUG_MOD_ID matches companion mod id", () => {
  assert.equal(DEBUG_MOD_ID, COMPANION_MOD_ID);
  assert.equal(COMPANION_MOD_ID, "hot-reload");
});

test("getStorageSaveId migrates legacy irishbruse.debug namespace", () => {
  const originalWindow = globalThis.window;
  Object.defineProperty(globalThis, "window", {
    value: { electron: { saveExistsSync: () => true } },
    configurable: true,
  });

  const store = new Map<string, Map<string, unknown>>();
  const api = {
    storage: {
      ensure(modId: string) {
        if (!store.has(modId)) store.set(modId, new Map());
      },
      get(modId: string, key: string) {
        return store.get(modId)?.get(key);
      },
      set(modId: string, key: string, value: unknown) {
        this.ensure(modId);
        store.get(modId)!.set(key, value);
      },
    },
  } as unknown as SandkitApi;

  try {
    api.storage.ensure("irishbruse.debug");
    api.storage.set("irishbruse.debug", START_SAVE_STORAGE_KEY, "legacy-save");

    assert.equal(getStorageSaveId(api), "legacy-save");
    assert.equal(api.storage.get(DEBUG_MOD_ID, START_SAVE_STORAGE_KEY), "legacy-save");
  } finally {
    Object.defineProperty(globalThis, "window", { value: originalWindow, configurable: true });
  }
});
