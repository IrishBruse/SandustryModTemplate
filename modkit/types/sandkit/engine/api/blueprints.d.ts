/**
 * `sandkit.engine.api.blueprints` — blueprint save, load, and import/export.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace blueprints {
  /** Delete a saved blueprint. Runtime property name is `delete`. */
  function _delete(...args: unknown[]): unknown;
  export { _delete as delete };
  /** Export all blueprints as one string. */
  export function exportAllString(...args: unknown[]): unknown;
  /** Export one blueprint as a string. */
  export function exportString(...args: unknown[]): unknown;
  /** Return all saved blueprints. */
  export function getAll(...args: unknown[]): unknown;
  /** Import a blueprint from a string. */
  export function importString(...args: unknown[]): unknown;
  /** Load a blueprint into the active session. */
  export function load(...args: unknown[]): unknown;
  /** Save the current selection as a blueprint. */
  export function save(...args: unknown[]): unknown;
}
