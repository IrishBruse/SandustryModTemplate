/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Read-only game config
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiGameConfig {
  /**
   * Return JsonValueV1 | undefined.
   * @param key key string.
   */
  get: (key: string) => unknown;
  /** Return all. */
  getAll: () => Record<string, unknown>;
}
export type ApiGameConfigNamespace = ApiGameConfig;
