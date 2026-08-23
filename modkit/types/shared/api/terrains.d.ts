import { CellCoordinates } from "../../shared/player";

export namespace terrains {
  export function getTypeFromId(terrainId: string): number;
  export function getTypeAtCell(...args: CellCoordinates): number | null;
  export function getDataAtCell(...args: CellCoordinates): { cellType: number; hp: number | null; } | null;
  export function isAtCell(...args: CellCoordinates): boolean;
  export function isTypeAtCell(...args: [...CellCoordinates, terrainId: string]): boolean;
  export function isCellIdTerrain(cellId: number): boolean;
  export function damageAtCell(...args: [...CellCoordinates, damage: number]): void;
  export function createAtCell(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;
  export function replaceAtCell(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;
  export function removeAtCell(...args: [...CellCoordinates, options?: TerrainMutationOptions]): void

  export type TerrainMutationOptions = unknown
}