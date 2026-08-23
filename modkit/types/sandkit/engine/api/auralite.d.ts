/**
 * `sandkit.engine.api.auralite` — auralite production tracking.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace auralite {
  /** Ensure at least the given amount of auralite has been produced. */
  export function ensureProducedAtLeast(...args: unknown[]): unknown;
  /** Return total auralite produced so far. */
  export function getProduced(...args: unknown[]): unknown;
}
