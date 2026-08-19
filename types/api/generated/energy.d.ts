/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Energy network
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiEnergy {
  /**
   * Add at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param amount amount.
   * @param options Optional settings object.
   */
  addAtCell: (cellX: number, cellY: number, amount: number, options: Record<string, unknown>) => void;
  /**
   * Return number.
   * @param amount amount.
   * @param options Optional settings object.
   */
  consume: (amount: number, options: Record<string, unknown>) => number;
  /**
   * Return number.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param amount amount.
   */
  consumeExcludingNetworkAtCell: (cellX: number, cellY: number, amount: number) => number;
  /**
   * Return network at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getNetworkAtCell: (cellX: number, cellY: number) => Record<string, unknown> | undefined;
  /**
   * Return network free capacity at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getNetworkFreeCapacityAtCell: (cellX: number, cellY: number) => number;
  /**
   * Register type.
   * @param structureId structure id.
   * @param options Optional settings object.
   */
  registerType: (structureId: string, type: string, options: Record<string, unknown>) => void;
}
export type ApiEnergyNamespace = ApiEnergy;
