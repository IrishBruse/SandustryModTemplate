/**
 * Structure registration, queries, recipes, and idle mutations.
 *
 * Available as `sandkit.api.structures`.
 *
 * @module
 */
import { CellCoordinates, Vector2 } from "../../shared/player";
import { structures as sharedStructures } from "../../shared/api/structures";

export namespace structures {

  /** Call callback for each structure of the given type. */
  export import forEachOfType = sharedStructures.forEachOfType
  /** Return the structure at a cell, or null. */
  export import getAtCell = sharedStructures.getAtCell
  /** Return the definition for a structure type. */
  export import getDefinitionByType = sharedStructures.getDefinitionByType
  /** Resolve a string structure id to its type. */
  export import getTypeFromId = sharedStructures.getTypeFromId
  /** Return true when a built structure exists at the cell. */
  export import hasBuiltAtCell = sharedStructures.hasBuiltAtCell
  /** Return true when a structure matches a string id. */
  export import isType = sharedStructures.isType
  /** Return true when the cell structure matches a string id. */
  export import isTypeAtCell = sharedStructures.isTypeAtCell
  /** Set spritesheet index on a structure instance. */
  export import setSpritesheetIndex = sharedStructures.setSpritesheetIndex
  /** Set spritesheet index on the structure at a cell. */
  export import setSpritesheetIndexAtCell = sharedStructures.setSpritesheetIndexAtCell
  /** Map a value through thresholds to a spritesheet index on a structure. */
  export import setSpritesheetIndexByValue = sharedStructures.setSpritesheetIndexByValue
  /** Map a value through thresholds to a spritesheet index at a cell. */
  export import setSpritesheetIndexByValueAtCell = sharedStructures.setSpritesheetIndexByValueAtCell
  /** Push structure state updates to the game and workers. */
  export import update = sharedStructures.update
  /** Set partial data on a structure instance. */
  export import setData = sharedStructures.setData
  /** Structure instance in the world. */
  export import Structure = sharedStructures.Structure
  /** Structure type id or enum value. */
  export import StructureType = sharedStructures.StructureType

  /** Register a structure processor handler. */
  export function addProcessor(structureId: string | StructureType, definition: StructureProcessorDefinitionV1): void;
  /** Register a new structure definition. */
  export function register(definition: SandkitStructureDefinition, options?: { useRawShape?: boolean; }): void;
  /** Patch fields on an existing structure definition. */
  export function updateDefinition(structureTypeOrId: string | StructureType, partial: Partial<SandkitStructureDefinition>, options?: { useRawShape?: boolean; }): void;
  /** Add a rotated variant to a base structure type. */
  export function addVariant(baseStructureTypeOrId: string | StructureType, variant: { id: string | StructureType; angles: number[]; }, options?: { addBuildMode?: any; }): void;
  /** Register placement rules for a structure. */
  export function registerPlacementConfig(definition: PlacementConfigDefinition): void;
  /** Return structure types unlocked for building. */
  export function getUnlockedTypes(): Set<string | StructureType>;
  /** Return true when the player blocks building at the cell. */
  export function isBlockedByPlayerAtCell(...args: CellCoordinates): boolean;
  /** Return true when a launcher structure is at the cell. */
  export function isLauncherAtCell(...args: CellCoordinates): boolean;
  /** Return true when a structure type is unlocked. */
  export function isUnlockedByType(structureType: string | StructureType): boolean;
  /** Map a numeric value through thresholds to a spritesheet index. */
  export function mapValueToSpritesheetIndex(value: number, thresholds: number[]): number;
  /** Build a structure at a cell when simulation is idle. */
  export function buildAtCellWhenIdle(...args: [...CellCoordinates, structureTypeOrId: string, options?: any]): void;
  /** Remove a structure at a cell when simulation is idle. */
  export function removeAtCellWhenIdle(...args: [...CellCoordinates, options?: { removeCells?: boolean; skipVisuals?: boolean; }]): void;
  /** Remove structures between two cells when simulation is idle. */
  export function removeBetweenCellsWhenIdle(startCellX: number, startCellY: number, endCellX: number, endCellY: number, options?: { removeCells?: boolean; preserveUnselectable?: boolean; onlyPositions?: Vector2[]; }): void;
  /** Remove structures at many cells when simulation is idle. */
  export function removeAtCellsWhenIdle(positions: Vector2[], options?: { removeCells?: boolean; skipVisuals?: boolean; }): void;

  /** Structure recipe registration by machine kind. */
  export namespace recipes {
    /** Register a planter box recipe. */
    export function register(id: 'planterBox', definition: PlanterBoxRecipeDefinitionV1): void;
    /** Register a shaker recipe. */
    export function register(id: 'shaker', definition: ShakerRecipeDefinitionV1): void;
    /** Register a kinetic press recipe. */
    export function register(id: 'kineticPress', definition: KineticPressRecipeDefinitionV1): void;
    /** Register a weighted refinery machine recipe. */
    export function register(id: 'condenser' | 'steamDryer' | 'synthesizer' | 'snowmaker' | 'smelter', definition: WeightedRefineryRecipeDefinitionV1): void;
  }

  /** Per-structure processing enablement and registration. */
  export namespace processing {
    /** Return true when processing is enabled at a cell. */
    export import isEnabledAt = sharedStructures.processing.isEnabledAt

    /** Register a custom processing definition by id. */
    export function register(id: string, definition: StructureProcessingDefinitionV1): void;
    /** Enable or disable processing at a cell. Return true when state changes. */
    export function setEnabledAt(...args: [...CellCoordinates, enabled: boolean]): boolean;
  }

  /** Build mode entry for a structure definition. */
  export interface StructureBuildMode {
    type: string;
    directions?: string[];
  }

  /** Rotated variant entry for a structure definition. */
  export interface StructureVariant {
    id: string | number;
    angles: number[];
  }

  /** Render settings for a structure definition. */
  export interface StructureRender {
    imageName?: string;
    size?: { width: number; height: number };
    offset?: { x: number; y: number };
  }

  /** Full structure definition registered with the game. */
  export interface SandkitStructureDefinition {
    id: string;
    nameKey?: string;
    descriptionKey?: string;
    categoryKey?: string;
    order?: number;
    buildModes?: StructureBuildMode[];
    shape?: number[][];
    variants?: StructureVariant[];
    render?: StructureRender;

    // Temporary until we're sure we have the full definition.
    [key: string]: unknown;
  }

  /** Structure processor handler definition shape. */
  export type StructureProcessorDefinitionV1 = unknown
  /** Placement rule definition shape. */
  export type PlacementConfigDefinition = unknown
  /** Planter box recipe definition shape. */
  export type PlanterBoxRecipeDefinitionV1 = unknown
  /** Shaker recipe definition shape. */
  export type ShakerRecipeDefinitionV1 = unknown
  /** Kinetic press recipe definition shape. */
  export type KineticPressRecipeDefinitionV1 = unknown
  /** Weighted refinery recipe definition shape. */
  export type WeightedRefineryRecipeDefinitionV1 = unknown
  /** Custom structure processing definition shape. */
  export type StructureProcessingDefinitionV1 = unknown
}
