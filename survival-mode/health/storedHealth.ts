export const HEALTH_MAX = 100;

function clampHealth(value: number): number {
  return Math.min(HEALTH_MAX, Math.max(0, Math.round(value)));
}

/** Map stored HP to a playable value. Zero and invalid values start at full health. */
export function resolveStoredHealth(stored: unknown): number {
  if (typeof stored !== "number" || !Number.isFinite(stored) || stored <= 0) {
    return HEALTH_MAX;
  }
  return clampHealth(stored);
}
