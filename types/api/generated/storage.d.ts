/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Mod and local storage
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiStorage {
  /**
   * Ensure  exists.
   * @param modId mod id.
   */
  ensure: (modId: string) => void;
  /**
   * Return any.
   * @param modId mod id.
   * @param key key string.
   */
  get: (modId: string, key: string) => unknown;
  local: ApiStorageLocal;
  /**
   * Remove .
   * @param modId mod id.
   * @param key key string.
   */
  remove: (modId: string, key: string) => void;
  /**
   * set.
   * @param modId mod id.
   * @param key key string.
   */
  set: (modId: string, key: string, value: unknown) => void;
}
export interface ApiStorageLocal {
  /**
   * Return any.
   * @param key key string.
   */
  get: (key: string) => unknown;
  /**
   * Remove .
   * @param key key string.
   */
  remove: (key: string) => void;
  /**
   * set.
   * @param key key string.
   */
  set: (key: string, value: unknown) => void;
}
export type ApiStorageNamespace = ApiStorage;
