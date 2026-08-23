/**
 * `sandkit.engine.api.sweeperDrone` — sweeper drone selection control.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace sweeperDrone {
  /**
   * Cancel the active sweeper drone selection.
   * @param args - Game state first, then method-specific arguments.
   */
  export function cancelSelection(...args: unknown[]): unknown;
}
