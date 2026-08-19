/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Burning elements
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiFire {
  /**
   * burn Element At Cell When Idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  burnElementAtCellWhenIdle: (cellX: number, cellY: number) => void;
  /**
   * Return whether can burn element at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  canBurnElementAtCell: (cellX: number, cellY: number) => boolean;
}
export type ApiFireNamespace = ApiFire;
