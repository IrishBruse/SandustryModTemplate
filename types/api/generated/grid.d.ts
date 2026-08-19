/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Rect/circle iteration
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiGrid {
  /**
   * Iterate cell in circle.
   * @param centerCellX Cell X coordinate.
   * @param centerCellY Cell Y coordinate.
   * @param radius radius.
   * @param callback Callback function.
   */
  forEachCellInCircle: (centerCellX: number, centerCellY: number, radius: number, callback: (cellX: number, cellY: number) => void) => void;
  /**
   * Iterate cell in rect.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param width width id.
   * @param height height.
   * @param callback Callback function.
   */
  forEachCellInRect: (cellX: number, cellY: number, width: number, height: number, callback: (cellX: number, cellY: number) => void) => void;
}
export type ApiGridNamespace = ApiGrid;
