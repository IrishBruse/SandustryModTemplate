/**
 * `sandkit.engine.api.foliage` — procedural foliage generation and clusters.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace foliage {
  /** Generate foliage for a region or world chunk. */
  export function generate(...args: unknown[]): unknown;
  /** Return foliage cluster data. */
  export function getClusters(...args: unknown[]): unknown;
  /** Return the foliage render container. */
  export function getContainer(...args: unknown[]): unknown;
  /** Return whether procgen foliage data exists for a location. */
  export function hasProcgenData(...args: unknown[]): unknown;
}
