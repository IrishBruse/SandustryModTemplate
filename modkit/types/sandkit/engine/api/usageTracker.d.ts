/**
 * Engine-only: `sandkit.engine.api.usageTracker`.
 * @internal
 */
export namespace usageTracker {
  export function clear(...args: unknown[]): unknown;
  export function getLatest(...args: unknown[]): unknown;
  export function getMostUsed(...args: unknown[]): unknown;
}
