/**
 * Engine-only: `sandkit.engine.api.blueprints`.
 * @internal
 */
export namespace blueprints {
  /** Runtime property name is `delete`. */
  function _delete(...args: unknown[]): unknown;
  export { _delete as delete };
  export function exportAllString(...args: unknown[]): unknown;
  export function exportString(...args: unknown[]): unknown;
  export function getAll(...args: unknown[]): unknown;
  export function importString(...args: unknown[]): unknown;
  export function load(...args: unknown[]): unknown;
  export function save(...args: unknown[]): unknown;
}
