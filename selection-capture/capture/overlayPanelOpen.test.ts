import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_CAPTURE_OVERLAY, type CaptureOverlaySettings } from "./captureSettings.ts";
import { isOverlayPanelOpen, shouldCompositeOverlayAfterCapture } from "./overlayPanelOpen.ts";

const KEY = "irishbruse.selection-capture:overlay";

function overlaySettings(overrides: Partial<CaptureOverlaySettings>): CaptureOverlaySettings {
  return { ...DEFAULT_CAPTURE_OVERLAY, ...overrides };
}

test("isOverlayPanelOpen reads the live overlay panel flag", () => {
  const root = globalThis as unknown as Record<string, { open?: boolean } | undefined>;
  root[KEY] = { open: true };
  assert.equal(isOverlayPanelOpen(), true);
  root[KEY] = { open: false };
  assert.equal(isOverlayPanelOpen(), false);
  delete root[KEY];
  assert.equal(isOverlayPanelOpen(), false);
});

test("shouldCompositeOverlayAfterCapture skips simple overlay while panel is open", () => {
  const root = globalThis as unknown as Record<string, { open?: boolean } | undefined>;
  root[KEY] = { open: true };
  assert.equal(
    shouldCompositeOverlayAfterCapture(overlaySettings({ enabled: true, advanced: false })),
    false,
  );
  root[KEY] = { open: false };
  assert.equal(
    shouldCompositeOverlayAfterCapture(overlaySettings({ enabled: true, advanced: false })),
    true,
  );
  delete root[KEY];
});

test("shouldCompositeOverlayAfterCapture always composites advanced overlay", () => {
  const root = globalThis as unknown as Record<string, { open?: boolean } | undefined>;
  root[KEY] = { open: true };
  assert.equal(
    shouldCompositeOverlayAfterCapture(overlaySettings({ enabled: true, advanced: true })),
    true,
  );
  delete root[KEY];
});
