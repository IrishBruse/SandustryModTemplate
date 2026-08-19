/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Discovery journal
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiDiscoveries {
  /**
   * Add element by type.
   * @param elementType element Type.
   */
  addElementByType: (elementType: number) => void;
  /**
   * Add terrain by type.
   * @param terrainType terrain Type.
   */
  addTerrainByType: (terrainType: number) => void;
}
export type ApiDiscoveriesNamespace = ApiDiscoveries;
