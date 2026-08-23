/**
 * `sandkit.engine.api.strataform` — strataform event triggers and type registration.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace strataform {
  /**
   * Return the default strataform configuration.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getDefaultConfig(...args: unknown[]): unknown;
  /**
   * Return all registered strataform types.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getRegisteredTypes(...args: unknown[]): unknown;
  /**
   * Register a custom strataform type.
   * @param args - Game state first, then method-specific arguments.
   */
  export function registerType(...args: unknown[]): unknown;
  /**
   * Trigger a strataform event at a location.
   * @param args - Game state first, then method-specific arguments.
   */
  export function trigger(...args: unknown[]): unknown;
  /**
   * Trigger a strataform event by type id.
   * @param args - Game state first, then method-specific arguments.
   */
  export function triggerByType(...args: unknown[]): unknown;
}
