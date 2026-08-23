import { CellCoordinates } from "../../shared/player";

/**
 * Shared `sandkit.api.terrains` base — terrain type lookup and cell mutation.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace terrains {
  /** Resolve a terrain string id to a numeric type. */
  export function getTypeFromId(terrainId: string): number;
  /** Terrain type at a cell, or null when none. */
  export function getTypeAtCell(...args: CellCoordinates): number | null;
  /** Terrain cell type and hit points at a cell. */
  export function getDataAtCell(...args: CellCoordinates): { cellType: number; hp: number | null; } | null;
  /** True when any terrain occupies the cell. */
  export function isAtCell(...args: CellCoordinates): boolean;
  /** True when the cell terrain matches the given id. */
  export function isTypeAtCell(...args: [...CellCoordinates, terrainId: string]): boolean;
  /** True when a packed cell id refers to terrain. */
  export function isCellIdTerrain(cellId: number): boolean;
  /** Apply damage to terrain at a cell. */
  export function damageAtCell(...args: [...CellCoordinates, damage: number]): void;
  /** Place terrain at an empty cell. */
  export function createAtCell(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;
  /** Replace existing terrain at a cell. */
  export function replaceAtCell(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;
  /** Remove terrain from a cell. */
  export function removeAtCell(...args: [...CellCoordinates, options?: TerrainMutationOptions]): void

  /** Options for terrain create, replace, or remove. */
  export type TerrainMutationOptions = unknown
}
