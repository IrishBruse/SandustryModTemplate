/**
 * `sandkit.engine.api.drones` — drone spawn and removal.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace drones {
  /**
   * Remove one or more drones.
   * @param args - Game state first, then method-specific arguments.
   */
  export function kill(...args: unknown[]): unknown;
  /**
   * Spawn a drone instance.
   * @param args - Game state first, then method-specific arguments.
   */
  export function spawn(...args: unknown[]): unknown;
}
