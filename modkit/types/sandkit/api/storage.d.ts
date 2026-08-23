/**
 * Per-mod persistent storage and local session storage.
 *
 * Available as `sandkit.api.storage`.
 *
 * @module
 */
export namespace storage {
  /** Ensure storage exists for a mod id. */
  export function ensure(modId: string): any;
  /** Read a value from mod storage by key. */
  export function get(modId: string, key: string): any;
  /** Write a value to mod storage by key. */
  export function set(modId: string, key: string, value: any): void;
  /** Remove a key from mod storage. */
  export function remove(modId: string, key: string): void;

  /** Local session storage without mod id scope. */
  export namespace local {
    /** Read a local storage value by key. */
    export function get(key: string): any;
    /** Write a local storage value by key. */
    export function set(key: string, value: any): void;
    /** Remove a local storage key. */
    export function remove(key: string): void;
  }
}
