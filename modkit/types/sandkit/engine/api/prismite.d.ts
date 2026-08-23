/**
 * `sandkit.engine.api.prismite` — prismite resource consume and availability.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace prismite {
  /** Consume prismite from the player or world. */
  export function consume(...args: unknown[]): unknown;
  /** Return available prismite amount. */
  export function getAvailable(...args: unknown[]): unknown;
  /** Return total prismite consumed so far. */
  export function getConsumed(...args: unknown[]): unknown;
}
