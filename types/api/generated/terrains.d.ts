/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Terrain registration and mutation
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiTerrains {
  /**
   * Create at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param terrainTypeOrId terrain Type Or id.
   * @param options Optional settings object.
   */
  createAtCellWhenIdle: (cellX: number, cellY: number, terrainTypeOrId: string | number, options?: TerrainMutationOptions) => void;
  /**
   * Apply damage at a cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param damage damage.
   */
  damageAtCell: (cellX: number, cellY: number, damage: number) => void;
  /**
   * Return data at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getDataAtCell: (cellX: number, cellY: number) => { cellType: number; hp: number | null; } | null;
  /**
   * Return type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getTypeAtCell: (cellX: number, cellY: number) => number | null;
  /**
   * Return type from id.
   * @param terrainId terrain id.
   */
  getTypeFromId: (terrainId: string) => number;
  /**
   * Return whether at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isAtCell: (cellX: number, cellY: number) => boolean;
  /**
   * Return whether cell id terrain.
   * @param cellId cell id.
   */
  isCellIdTerrain: (cellId: number) => boolean;
  /**
   * Return whether type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param terrainId terrain id.
   */
  isTypeAtCell: (cellX: number, cellY: number, terrainId: string) => boolean;
  /**
   * Register a definition.
   * @param definition Registration definition object.
   */
  register: (definition: TerrainDefinition) => { cellType: number; };
  /**
   * Remove at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param options Optional settings object.
   */
  removeAtCellWhenIdle: (cellX: number, cellY: number, options?: TerrainMutationOptions) => void;
  /**
   * Replace at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param terrainTypeOrId terrain Type Or id.
   * @param options Optional settings object.
   */
  replaceAtCellWhenIdle: (cellX: number, cellY: number, terrainTypeOrId: string | number, options?: TerrainMutationOptions) => void;
  /**
   * Set hp at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param hp hp.
   */
  setHpAtCellWhenIdle: (cellX: number, cellY: number, hp: number) => void;
  /**
   * Update definition.
   * @param cellTypeOrId cell Type Or id.
   * @param partial Optional settings object.
   */
  updateDefinition: (cellTypeOrId: string | number, partial: Partial<TerrainDefinition>) => void;
}
export type ApiTerrainsNamespace = ApiTerrains;
