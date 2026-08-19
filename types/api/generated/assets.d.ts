/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Mod asset provider selection
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiAssets {
  /**
   * Return selected provider.
   * @param kind kind string.
   */
  getSelectedProvider: (kind: string) => string | null;
  /**
   * Return url.
   * @param relativePath relative Path string.
   */
  getUrl: (relativePath: string) => string;
  /**
   * Select provider.
   * @param kind kind string.
   * @param providerId provider id.
   */
  selectProvider: (kind: string, providerId: string) => void;
}
export type ApiAssetsNamespace = ApiAssets;
