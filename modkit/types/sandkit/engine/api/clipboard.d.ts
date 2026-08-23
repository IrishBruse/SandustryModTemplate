/**
 * Engine-only: `sandkit.engine.api.clipboard`.
 * @internal
 */
export namespace clipboard {
  export function activate(...args: unknown[]): unknown;
  export function clear(...args: unknown[]): unknown;
  export function get(...args: unknown[]): unknown;
  export function getHistory(...args: unknown[]): unknown;
  export function getSignalLinks(...args: unknown[]): unknown;
  export function selectFromHistory(...args: unknown[]): unknown;
  export function set(...args: unknown[]): unknown;
}
