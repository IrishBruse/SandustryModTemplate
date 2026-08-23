import { CellCoordinates } from "../../shared/player";

/**
 * Shared `sandkit.api.terrains` base — terrain type lookup and cell mutation.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace terrains {
  /**
   * Resolve a terrain string id to a numeric cell type.
   * @param terrainId - Mod-registered or built-in terrain id.
   * @returns Numeric terrain cell type.
   */
  export function getTypeFromId(terrainId: string): number;

  /**
   * Return the terrain cell type at a cell, or null when none.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function getTypeAtCell(...args: CellCoordinates): number | null;

  /**
   * Return terrain cell type and hit points at a cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @returns Cell type and hp, or null when the cell is not terrain.
   */
  export function getDataAtCell(...args: CellCoordinates): { cellType: number; hp: number | null; } | null;

  /**
   * Return true when any terrain occupies the cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function isAtCell(...args: CellCoordinates): boolean;

  /**
   * Return true when the cell terrain matches the given id.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param terrainId - Terrain string id to compare.
   */
  export function isTypeAtCell(...args: [...CellCoordinates, terrainId: string]): boolean;

  /**
   * Return true when a packed cell id refers to terrain.
   * @param cellId - Packed cell id from {@link world.getCellIdAtCell}.
   */
  export function isCellIdTerrain(cellId: number): boolean;

  /**
   * Apply damage to terrain at a cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param damage - Damage amount to apply.
   */
  export function damageAtCell(...args: [...CellCoordinates, damage: number]): void;

  /**
   * Place terrain at an empty cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param terrainTypeOrId - Numeric cell type or terrain string id.
   * @param options - Optional mutation flags.
   */
  export function createAtCell(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;

  /**
   * Replace existing terrain at a cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param terrainTypeOrId - Numeric cell type or terrain string id.
   * @param options - Optional mutation flags.
   */
  export function replaceAtCell(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;

  /**
   * Remove terrain from a cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param options - Optional mutation flags.
   */
  export function removeAtCell(...args: [...CellCoordinates, options?: TerrainMutationOptions]): void;

  /** Options for terrain create, replace, or remove calls. */
  export interface TerrainMutationOptions {
    /** Skip shadow updates around the changed cell. */
    skipShadow?: boolean;
  }
}
