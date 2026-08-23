/**
 * `sandkit.engine.api.game` — game session start, save, and load.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace game {
  /**
   * Load a saved game into the session.
   * @param args - Game state first, then method-specific arguments.
   */
  export function load(...args: unknown[]): unknown;
  /**
   * Save the current session.
   * @param args - Game state first, then method-specific arguments.
   */
  export function save(...args: unknown[]): unknown;
  /**
   * Start a new game session.
   * @param args - Game state first, then method-specific arguments.
   */
  export function start(...args: unknown[]): unknown;
}
