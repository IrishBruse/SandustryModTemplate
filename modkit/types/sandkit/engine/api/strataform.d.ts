/**
 * `sandkit.engine.api.strataform` — strataform event triggers and type registration.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace strataform {
  /** Return the default strataform configuration. */
  export function getDefaultConfig(...args: unknown[]): unknown;
  /** Return all registered strataform types. */
  export function getRegisteredTypes(...args: unknown[]): unknown;
  /** Register a custom strataform type. */
  export function registerType(...args: unknown[]): unknown;
  /** Trigger a strataform event at a location. */
  export function trigger(...args: unknown[]): unknown;
  /** Trigger a strataform event by type id. */
  export function triggerByType(...args: unknown[]): unknown;
}
