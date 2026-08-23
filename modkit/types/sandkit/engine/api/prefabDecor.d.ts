/**
 * `sandkit.engine.api.prefabDecor` — prefab decorative placement.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace prefabDecor {
  /**
   * Return a decor placement definition by name.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getPlacementByName(...args: unknown[]): unknown;
  /**
   * Replace decor instances in a region or prefab.
   * @param args - Game state first, then method-specific arguments.
   */
  export function replaceDecor(...args: unknown[]): unknown;
}
