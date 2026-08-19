/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Cross-thread shared buffers
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiShared {
  buffers: ApiSharedBuffers;
}
export interface ApiSharedBuffers {
  /**
   * Create a resource.
   * @param key key string.
   * @param config config.
   */
  create: (key: string, config: { type: SharedArrayType; length: number; }) => SharedArray;
  /**
   * Return SharedArray | undefined.
   * @param key key string.
   */
  get: (key: string) => SharedArray | undefined;
}
export type ApiSharedNamespace = ApiShared;
