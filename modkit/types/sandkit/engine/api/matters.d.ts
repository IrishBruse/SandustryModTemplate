/**
 * `sandkit.engine.api.matters` — matter type registration and solid updates.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace matters {
  /** Resolve a matter type from an id string. */
  export function getMatterTypeFromId(...args: unknown[]): unknown;
  /** Register a custom matter type. */
  export function register(...args: unknown[]): unknown;
  /** Run one solid-matter update step. */
  export function runSolidUpdate(...args: unknown[]): unknown;
}
