/**
 * `sandkit.engine.api.prefabDecor` — prefab decorative placement.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace prefabDecor {
  /** Return a decor placement definition by name. */
  export function getPlacementByName(...args: unknown[]): unknown;
  /** Replace decor instances in a region or prefab. */
  export function replaceDecor(...args: unknown[]): unknown;
}
