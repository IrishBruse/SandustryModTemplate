/**
 * `sandkit.engine.api.usageTracker` — tool and structure usage statistics.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace usageTracker {
  /**
   * Clear recorded usage statistics.
   * @param args - Game state first, then method-specific arguments.
   */
  export function clear(...args: unknown[]): unknown;
  /**
   * Return the most recently used item or structure.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getLatest(...args: unknown[]): unknown;
  /**
   * Return the most frequently used item or structure.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getMostUsed(...args: unknown[]): unknown;
}
