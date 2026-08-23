/**
 * `sandkit.engine.api.prefabulator` — blueprint structure serialization for prefabs.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace prefabulator {
  /**
   * Convert serialized blueprint structures to world-local coordinates.
   * @param args - Game state first, then method-specific arguments.
   */
  export function localizeBlueprintStructures(...args: unknown[]): unknown;
  /**
   * Serialize blueprint structures for prefab storage.
   * @param args - Game state first, then method-specific arguments.
   */
  export function serializeBlueprintStructures(...args: unknown[]): unknown;
}
