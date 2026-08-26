/**
 * Terrain registration, queries, and idle cell mutations.
 *
 * Available as `sandkit.api.terrains`.
 *
 * @module
 */
import { CellCoordinates } from '../../shared/player';
import { shared } from '../../shared';
import type { elements } from './elements';

export namespace terrains {

  /** Resolve a terrain string id to its cell type number. */
  export import getTypeFromId = shared.api.terrains.getTypeFromId;
  /** Return terrain cell type at a cell, or null. */
  export import getTypeAtCell = shared.api.terrains.getTypeAtCell;
  /** Return terrain data at a cell, or null. */
  export import getDataAtCell = shared.api.terrains.getDataAtCell;
  /** Return true when any terrain exists at the cell. */
  export import isAtCell = shared.api.terrains.isAtCell;
  /** Return true when terrain at the cell matches a string id. */
  export import isTypeAtCell = shared.api.terrains.isTypeAtCell;
  /** Return true when a cell id represents terrain. */
  export import isCellIdTerrain = shared.api.terrains.isCellIdTerrain;
  /** Apply damage to terrain at a cell. */
  export import damageAtCell = shared.api.terrains.damageAtCell;
  /** Create terrain at a cell immediately. */
  export import createAtCell = shared.api.terrains.createAtCell;
  /** Replace terrain at a cell immediately. */
  export import replaceAtCell = shared.api.terrains.replaceAtCell;
  /** Remove terrain at a cell immediately. */
  export import removeAtCell = shared.api.terrains.removeAtCell;
  /** Options for terrain create, replace, and remove calls. */
  export import TerrainMutationOptions = shared.api.terrains.TerrainMutationOptions;
  /** Numeric terrain cell type handle. */
  export import TerrainType = shared.api.terrains.TerrainType;
  /** Mod or built-in terrain string id. */
  export import TerrainId = shared.api.terrains.TerrainId;
  /** Type handle or string id accepted by mutation helpers. */
  export import TerrainRef = shared.api.terrains.TerrainRef;

  /**
   * Register a new terrain definition.
   * @param definition - Terrain definition to register.
   * @returns Object with the assigned `cellType`.
   */
  export function register(definition: TerrainDefinition): { cellType: TerrainType; };

  /**
   * Patch fields on an existing terrain definition.
   * @param cellTypeOrId - Numeric cell type or terrain string id.
   * @param partial - Fields to merge onto the definition.
   */
  export function updateDefinition(cellTypeOrId: TerrainRef, partial: Partial<TerrainDefinition>): void;

  /**
   * Create terrain at a cell when simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param terrainTypeOrId - Numeric cell type or terrain string id.
   * @param options - Optional mutation flags.
   */
  export function createAtCellWhenIdle(...args: [...CellCoordinates, terrainTypeOrId: TerrainRef, options?: TerrainMutationOptions]): void;

  /**
   * Replace terrain at a cell when simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param terrainTypeOrId - Numeric cell type or terrain string id.
   * @param options - Optional mutation flags.
   */
  export function replaceAtCellWhenIdle(...args: [...CellCoordinates, terrainTypeOrId: TerrainRef, options?: TerrainMutationOptions]): void;

  /**
   * Remove terrain at a cell when simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param options - Optional mutation flags.
   */
  export function removeAtCellWhenIdle(...args: [...CellCoordinates, options?: TerrainMutationOptions]): void;

  /**
   * Set terrain hit points at a cell when simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param hp - New hit point value.
   */
  export function setHpAtCellWhenIdle(...args: [...CellCoordinates, hp: number]): void;

  /**
   * Set terrain hit points at a cell immediately.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param hp - New hit point value.
   * @returns True when hp changed or the terrain was removed.
   */
  export function setHpAtCell(...args: [...CellCoordinates, hp: number]): boolean;

  /** Terrain definition shape for {@link register} and {@link updateDefinition}. */
  export interface TerrainDefinition {
    /** Unique mod-scoped terrain id. */
    id: string;
    /** i18n key for the terrain display name. */
    nameKey?: string;
    /** Default terrain hit points. */
    hp?: number;
    /** Material id used for rendering. Must be > obstacle breakpoint and < 150. */
    materialId?: number;
    /** UI/meta color as 0xRRGGBB. */
    metaColor?: number;
    /** Base terrain color as HSL components. */
    colorHSL?: [number, number, number];
    /** Tool item ids required to excavate this terrain. */
    excavationRequirements?: readonly string[];
    /** Tooltip interactions shown for this terrain. */
    interactions?: readonly elements.Interaction[];
    /** Default element drop when the terrain is destroyed. */
    output?: {
      elementType: elements.ElementType;
      chance: number;
    };
    [key: string]: unknown;
  }
}
