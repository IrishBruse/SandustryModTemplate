import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  DEFAULT_CAPTURE_SETTINGS,
  loadCaptureSettings,
  normalizeCaptureSettings,
  saveCaptureSettings,
} from "./captureSettings.ts";

const STORAGE_KEY = "irishbruse.selection-capture.settings";

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => {
      storage.set(key, value);
    },
    removeItem: (key) => {
      storage.delete(key);
    },
    clear: () => storage.clear(),
    key: () => null,
    length: 0,
  };
});

afterEach(() => {
  delete (globalThis as { localStorage?: Storage }).localStorage;
});

test("normalizeCaptureSettings clamps invalid values", () => {
  assert.deepEqual(
    normalizeCaptureSettings({
      frames: 999,
      ticksPerFrame: 0,
      blockPadding: -5,
      greenscreen: true,
      showMouse: "yes",
      limit1Mb: true,
    }),
    {
      frames: 120,
      ticksPerFrame: 1,
      blockPadding: 0,
      greenscreen: true,
      showMouse: false,
      limit1Mb: true,
    },
  );
});

test("saveCaptureSettings and loadCaptureSettings round-trip", () => {
  const settings = {
    frames: 24,
    ticksPerFrame: 3,
    blockPadding: 2,
    greenscreen: true,
    showMouse: true,
    limit1Mb: false,
  };
  saveCaptureSettings(settings);
  assert.equal(storage.get(STORAGE_KEY), JSON.stringify(settings));
  assert.deepEqual(loadCaptureSettings(), settings);
});

test("loadCaptureSettings returns defaults when storage is empty", () => {
  assert.deepEqual(loadCaptureSettings(), DEFAULT_CAPTURE_SETTINGS);
});
