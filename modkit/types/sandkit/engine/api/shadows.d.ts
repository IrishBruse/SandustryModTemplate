/**
 * `sandkit.engine.api.shadows` — shadow map refresh for regions.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace shadows {
  /** Refresh shadows for the whole visible area. */
  export function refresh(...args: unknown[]): unknown;
  /** Refresh shadows within a circular radius. */
  export function refreshRadius(...args: unknown[]): unknown;
  /** Refresh shadows within a rectangle. */
  export function refreshRect(...args: unknown[]): unknown;
}
