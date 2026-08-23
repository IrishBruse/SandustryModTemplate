import { CellCoordinates } from '../../shared/player';
import { terrains as sharedTerrains } from '../../shared/api/terrains';

export namespace terrains {

  export import getTypeFromId = sharedTerrains.getTypeFromId
  export import getTypeAtCell = sharedTerrains.getTypeAtCell
  export import getDataAtCell = sharedTerrains.getDataAtCell
  export import isAtCell = sharedTerrains.isAtCell
  export import isTypeAtCell = sharedTerrains.isTypeAtCell
  export import isCellIdTerrain = sharedTerrains.isCellIdTerrain
  export import damageAtCell = sharedTerrains.damageAtCell
  export import createAtCell = sharedTerrains.createAtCell
  export import replaceAtCell = sharedTerrains.replaceAtCell
  export import removeAtCell = sharedTerrains.removeAtCell
  export import TerrainMutationOptions = sharedTerrains.TerrainMutationOptions




  export function register(definition: TerrainDefinition): { cellType: number; };
  export function updateDefinition(cellTypeOrId: string | number, partial: Partial<TerrainDefinition>): void;
  export function createAtCellWhenIdle(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;
  export function replaceAtCellWhenIdle(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;
  export function removeAtCellWhenIdle(...args: [...CellCoordinates, options?: TerrainMutationOptions]): void;
  export function setHpAtCellWhenIdle(...args: [...CellCoordinates, hp: number]): void;
  export function setHpAtCell(...args: [...CellCoordinates, hp: number]): boolean;

  export type TerrainDefinition = unknown
}