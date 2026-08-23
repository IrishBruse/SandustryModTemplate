/**
 * Terrain registration, queries, and idle cell mutations.
 *
 * Available as `sandkit.api.terrains`.
 *
 * @module
 */
import { CellCoordinates } from '../../shared/player';
import { terrains as sharedTerrains } from '../../shared/api/terrains';

export namespace terrains {

  /** Resolve a terrain string id to its cell type number. */
  export import getTypeFromId = sharedTerrains.getTypeFromId
  /** Return terrain cell type at a cell, or null. */
  export import getTypeAtCell = sharedTerrains.getTypeAtCell
  /** Return terrain data at a cell, or null. */
  export import getDataAtCell = sharedTerrains.getDataAtCell
  /** Return true when any terrain exists at the cell. */
  export import isAtCell = sharedTerrains.isAtCell
  /** Return true when terrain at the cell matches a string id. */
  export import isTypeAtCell = sharedTerrains.isTypeAtCell
  /** Return true when a cell id represents terrain. */
  export import isCellIdTerrain = sharedTerrains.isCellIdTerrain
  /** Apply damage to terrain at a cell. */
  export import damageAtCell = sharedTerrains.damageAtCell
  /** Create terrain at a cell immediately. */
  export import createAtCell = sharedTerrains.createAtCell
  /** Replace terrain at a cell immediately. */
  export import replaceAtCell = sharedTerrains.replaceAtCell
  /** Remove terrain at a cell immediately. */
  export import removeAtCell = sharedTerrains.removeAtCell
  /** Options for terrain create, replace, and remove calls. */
  export import TerrainMutationOptions = sharedTerrains.TerrainMutationOptions

  /** Register a new terrain definition. Return the assigned cell type. */
  export function register(definition: TerrainDefinition): { cellType: number; };
  /** Patch fields on an existing terrain definition. */
  export function updateDefinition(cellTypeOrId: string | number, partial: Partial<TerrainDefinition>): void;
  /** Create terrain at a cell when simulation is idle. */
  export function createAtCellWhenIdle(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;
  /** Replace terrain at a cell when simulation is idle. */
  export function replaceAtCellWhenIdle(...args: [...CellCoordinates, terrainTypeOrId: string | number, options?: TerrainMutationOptions]): void;
  /** Remove terrain at a cell when simulation is idle. */
  export function removeAtCellWhenIdle(...args: [...CellCoordinates, options?: TerrainMutationOptions]): void;
  /** Set terrain hit points at a cell when simulation is idle. */
  export function setHpAtCellWhenIdle(...args: [...CellCoordinates, hp: number]): void;
  /** Set terrain hit points at a cell immediately. Return true when hp changes. */
  export function setHpAtCell(...args: [...CellCoordinates, hp: number]): boolean;

  /** Terrain definition shape for register and update. */
  export type TerrainDefinition = unknown
}
