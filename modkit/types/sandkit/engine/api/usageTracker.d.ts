/**
 * `sandkit.engine.api.usageTracker` — tool and structure usage statistics.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace usageTracker {
  /** Clear recorded usage statistics. */
  export function clear(...args: unknown[]): unknown;
  /** Return the most recently used item or structure. */
  export function getLatest(...args: unknown[]): unknown;
  /** Return the most frequently used item or structure. */
  export function getMostUsed(...args: unknown[]): unknown;
}
