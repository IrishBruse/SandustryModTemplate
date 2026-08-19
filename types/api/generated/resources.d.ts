/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Fluxite and energy UI
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiResources {
  /**
   * collect Fluxite At Cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  collectFluxiteAtCell: (cellX: number, cellY: number) => void;
  /**
   * Update energy.
   * @param amount amount.
   * @param options Optional settings object.
   */
  updateEnergy: (amount: number, options: Record<string, unknown>) => void;
}
export type ApiResourcesNamespace = ApiResources;
