/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Placement helpers
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiBuilding {
  /** Cancel placement. */
  cancelPlacement: () => void;
  /**
   * Return snapped position at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getSnappedPositionAtCell: (cellX: number, cellY: number) => { x: number; y: number };
  /**
   * Return whether blocked at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isBlockedAtCell: (cellX: number, cellY: number) => boolean;
  /**
   * Select structure.
   * @param structureTypeOrId structure Type Or id.
   */
  selectStructure: (structureTypeOrId: string) => void;
}
export type ApiBuildingNamespace = ApiBuilding;
