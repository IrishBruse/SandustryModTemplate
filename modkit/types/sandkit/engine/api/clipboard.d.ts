/**
 * `sandkit.engine.api.clipboard` — build clipboard copy, paste, and history.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace clipboard {
  /**
   * Activate the clipboard tool or mode.
   * @param args - Game state first, then method-specific arguments.
   */
  export function activate(...args: unknown[]): unknown;
  /**
   * Clear the current clipboard contents.
   * @param args - Game state first, then method-specific arguments.
   */
  export function clear(...args: unknown[]): unknown;
  /**
   * Return the current clipboard payload.
   * @param args - Game state first, then method-specific arguments.
   */
  export function get(...args: unknown[]): unknown;
  /**
   * Return clipboard history entries.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getHistory(...args: unknown[]): unknown;
  /**
   * Return signal links stored on the clipboard.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getSignalLinks(...args: unknown[]): unknown;
  /**
   * Restore a clipboard entry from history.
   * @param args - Game state first, then method-specific arguments.
   */
  export function selectFromHistory(...args: unknown[]): unknown;
  /**
   * Set the clipboard payload.
   * @param args - Game state first, then method-specific arguments.
   */
  export function set(...args: unknown[]): unknown;
}
