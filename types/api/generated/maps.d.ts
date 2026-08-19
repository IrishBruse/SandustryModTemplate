/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Custom maps
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiMaps {
  /** Return active. */
  getActive: () => string | null;
  /** Return available. */
  getAvailable: () => string[];
  /**
   * Return boolean.
   * @param mapId map id.
   */
  start: (mapId: string) => void;
}
export type ApiMapsNamespace = ApiMaps;
