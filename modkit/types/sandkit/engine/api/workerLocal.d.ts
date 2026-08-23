/**
 * Engine-only: `sandkit.engine.api.workerLocal`.
 * @internal
 */
export namespace workerLocal {
  export function clear(...args: unknown[]): unknown;
  export function get(...args: unknown[]): unknown;
  export function getOrInit(...args: unknown[]): unknown;
  export function set(...args: unknown[]): unknown;
}
