/**
 * `sandkit.engine.api.blueprints` — blueprint save, load, and import/export.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace blueprints {
  /**
   * Delete a saved blueprint. Runtime property name is `delete`.
   * @param args - Game state first, then method-specific arguments.
   */
  function _delete(...args: unknown[]): unknown;
  export { _delete as delete };
  /**
   * Export all blueprints as one string.
   * @param args - Game state first, then method-specific arguments.
   */
  export function exportAllString(...args: unknown[]): unknown;
  /**
   * Export one blueprint as a string.
   * @param args - Game state first, then method-specific arguments.
   */
  export function exportString(...args: unknown[]): unknown;
  /**
   * Return all saved blueprints.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAll(...args: unknown[]): unknown;
  /**
   * Import a blueprint from a string.
   * @param args - Game state first, then method-specific arguments.
   */
  export function importString(...args: unknown[]): unknown;
  /**
   * Load a blueprint into the active session.
   * @param args - Game state first, then method-specific arguments.
   */
  export function load(...args: unknown[]): unknown;
  /**
   * Save the current selection as a blueprint.
   * @param args - Game state first, then method-specific arguments.
   */
  export function save(...args: unknown[]): unknown;
}
