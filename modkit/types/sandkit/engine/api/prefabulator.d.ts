/**
 * `sandkit.engine.api.prefabulator` — blueprint structure serialization for prefabs.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace prefabulator {
  /** Convert serialized blueprint structures to world-local coordinates. */
  export function localizeBlueprintStructures(...args: unknown[]): unknown;
  /** Serialize blueprint structures for prefab storage. */
  export function serializeBlueprintStructures(...args: unknown[]): unknown;
}
