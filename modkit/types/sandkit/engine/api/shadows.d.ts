/**
 * `sandkit.engine.api.shadows` — shadow map refresh for regions.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace shadows {
  /**
   * Refresh shadows for the whole visible area.
   * @param args - Game state first, then method-specific arguments.
   */
  export function refresh(...args: unknown[]): unknown;
  /**
   * Refresh shadows within a circular radius.
   * @param args - Game state first, then method-specific arguments.
   */
  export function refreshRadius(...args: unknown[]): unknown;
  /**
   * Refresh shadows within a rectangle.
   * @param args - Game state first, then method-specific arguments.
   */
  export function refreshRect(...args: unknown[]): unknown;
}
