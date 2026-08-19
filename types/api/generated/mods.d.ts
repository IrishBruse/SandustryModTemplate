/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Mod provider listing
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiMods {
  /**
   * Return providers.
   * @param kind kind string.
   */
  getProviders: (kind: string) => string[];
}
export type ApiModsNamespace = ApiMods;
