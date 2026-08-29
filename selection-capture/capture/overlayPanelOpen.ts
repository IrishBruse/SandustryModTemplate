import type { CaptureOverlaySettings } from "./captureSettings";

const KEY = "irishbruse.selection-capture:overlay";

/** True while the F7 panel is open (caption may already be on overlayCanvas). */
export function isOverlayPanelOpen(): boolean {
  const live = (globalThis as unknown as Record<string, { open?: boolean } | undefined>)[KEY];
  return live?.open === true;
}

/** Skip post-capture compositing when overlay is already painted on overlayCanvas. */
export function shouldCompositeOverlayAfterCapture(overlay: CaptureOverlaySettings): boolean {
  if (!overlay.enabled) return false;
  if (overlay.advanced) return true;
  return !isOverlayPanelOpen();
}
