import { JsonObjectV1, JsonValueV1 } from "../../shared/jsonvalue";

/**
 * Per-mod persistent storage and local session storage.
 *
 * Available as `sandkit.api.storage`.
 *
 * @module
 */
export namespace storage {
  /**
   * Ensure storage exists for a mod id.
   * @param modId - Mod identifier (typically `modinfo.id`).
   */
  export function ensure(modId: string): JsonObjectV1;
  /**
   * Read a value from mod storage by key.
   * @param modId - Mod identifier.
   * @param key - Storage key.
   */
  export function get(modId: string, key: string): JsonValueV1 | undefined;
  /**
   * Write a value to mod storage by key.
   * @param modId - Mod identifier.
   * @param key - Storage key.
   * @param value - JSON-serializable value.
   */
  export function set(modId: string, key: string, value: JsonValueV1): void;
  /**
   * Remove a key from mod storage.
   * @param modId - Mod identifier.
   * @param key - Storage key.
   */
  export function remove(modId: string, key: string): void;

  /** Local session storage without mod id scope. */
  export namespace local {
    /**
     * Read a local storage value by key.
     * @param key - Storage key.
     */
    export function get(key: string): JsonValueV1 | undefined;
    /**
     * Write a local storage value by key.
     * @param key - Storage key.
     * @param value - JSON-serializable value.
     */
    export function set(key: string, value: JsonValueV1): void;
    /**
     * Remove a local storage key.
     * @param key - Storage key.
     */
    export function remove(key: string): void;
  }
}
