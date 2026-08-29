/** Keep in sync with `pngScale` / `gifScale` in `../modinfo.ts`. */
export const MIN_CAPTURE_SCALE = 1;
export const MAX_CAPTURE_SCALE = 8;
export const DEFAULT_CAPTURE_SCALE = 1;

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** Post-capture nearest-neighbor upscale factor. `1` keeps native crop pixels. */
export function readCaptureScale(value: unknown): number {
  return clampInt(value, MIN_CAPTURE_SCALE, MAX_CAPTURE_SCALE, DEFAULT_CAPTURE_SCALE);
}

export function modPngScale(api: SandkitApi): number {
  return readCaptureScale(api.settings.get("pngScale"));
}

export function modGifScale(api: SandkitApi): number {
  return readCaptureScale(api.settings.get("gifScale"));
}
