/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Custom maps
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiMaps {
  /** Return active. */
  getActive: () => Readonly<ActiveMapV1> | null;
  /** Return available. */
  getAvailable: () => readonly Readonly<AvailableMapV1>[];
  /**
   * Return boolean.
   * @param mapId map id.
   */
  start: (mapId: string) => boolean;
}
export type ApiMapsNamespace = ApiMaps;
