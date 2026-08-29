/** Keep in sync with `countdownSeconds` in `../modinfo.ts`. */
export const MIN_COUNTDOWN = 0;
export const MAX_COUNTDOWN = 10;
export const DEFAULT_COUNTDOWN = 3;

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** Whole seconds to wait before GIF capture. `0` starts at once. */
export function readCountdownSeconds(value: unknown): number {
  return clampInt(value, MIN_COUNTDOWN, MAX_COUNTDOWN, DEFAULT_COUNTDOWN);
}

export function modCountdownSeconds(api: SandkitApi): number {
  return readCountdownSeconds(api.settings.get("countdownSeconds"));
}

export function modDownloadPng(api: SandkitApi): boolean {
  return api.settings.get("downloadPng") === true;
}
