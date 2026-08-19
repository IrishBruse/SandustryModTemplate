/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Collector value queries
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiCollector {
  /**
   * Return value by type.
   * @param elementType element Type.
   */
  getValueByType: (elementType: number) => number;
  /**
   * Return value from cell id.
   * @param cellId cell id.
   */
  getValueFromCellId: (cellId: number) => number;
  /**
   * Return whether cell id collectable.
   * @param cellId cell id.
   */
  isCellIdCollectable: (cellId: number) => boolean;
  /**
   * Return whether cell id collectable for sprite.
   * @param cellId cell id.
   */
  isCellIdCollectableForSprite: (cellId: number) => boolean;
  /**
   * Notify pickup at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  notifyPickupAtCell: (cellX: number, cellY: number) => void;
}
export type ApiCollectorNamespace = ApiCollector;
