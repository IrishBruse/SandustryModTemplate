import { CellCoordinates, Vector2 } from "../../shared/player";
import { structures as sharedStructures } from "../../shared/api/structures";

export namespace structures {


  export import forEachOfType = sharedStructures.forEachOfType
  export import getAtCell = sharedStructures.getAtCell
  export import getDefinitionByType = sharedStructures.getDefinitionByType
  export import getTypeFromId = sharedStructures.getTypeFromId
  export import hasBuiltAtCell = sharedStructures.hasBuiltAtCell
  export import isType = sharedStructures.isType
  export import isTypeAtCell = sharedStructures.isTypeAtCell
  export import setSpritesheetIndex = sharedStructures.setSpritesheetIndex
  export import setSpritesheetIndexAtCell = sharedStructures.setSpritesheetIndexAtCell
  export import setSpritesheetIndexByValue = sharedStructures.setSpritesheetIndexByValue
  export import setSpritesheetIndexByValueAtCell = sharedStructures.setSpritesheetIndexByValueAtCell
  export import update = sharedStructures.update
  export import setData = sharedStructures.setData
  export import Structure = sharedStructures.Structure
  export import StructureType = sharedStructures.StructureType




  export function addProcessor(structureId: string | StructureType, definition: StructureProcessorDefinitionV1): void;
  export function register(definition: SandkitStructureDefinition, options?: { useRawShape?: boolean; }): void;
  export function updateDefinition(structureTypeOrId: string | StructureType, partial: Partial<SandkitStructureDefinition>, options?: { useRawShape?: boolean; }): void;
  export function addVariant(baseStructureTypeOrId: string | StructureType, variant: { id: string | StructureType; angles: number[]; }, options?: { addBuildMode?: any; }): void;
  export function registerPlacementConfig(definition: PlacementConfigDefinition): void;
  export function getUnlockedTypes(): Set<string | StructureType>;
  export function isBlockedByPlayerAtCell(...args: CellCoordinates): boolean;
  export function isLauncherAtCell(...args: CellCoordinates): boolean;
  export function isUnlockedByType(structureType: string | StructureType): boolean;
  export function mapValueToSpritesheetIndex(value: number, thresholds: number[]): number;
  export function buildAtCellWhenIdle(...args: [...CellCoordinates, structureTypeOrId: string, options?: any]): void;
  export function removeAtCellWhenIdle(...args: [...CellCoordinates, options?: { removeCells?: boolean; skipVisuals?: boolean; }]): void;
  export function removeBetweenCellsWhenIdle(startCellX: number, startCellY: number, endCellX: number, endCellY: number, options?: { removeCells?: boolean; preserveUnselectable?: boolean; onlyPositions?: Vector2[]; }): void;
  export function removeAtCellsWhenIdle(positions: Vector2[], options?: { removeCells?: boolean; skipVisuals?: boolean; }): void;


  export namespace recipes {
    export function register(id: 'planterBox', definition: PlanterBoxRecipeDefinitionV1): void;
    export function register(id: 'shaker', definition: ShakerRecipeDefinitionV1): void;
    export function register(id: 'kineticPress', definition: KineticPressRecipeDefinitionV1): void;
    export function register(id: 'condenser' | 'steamDryer' | 'synthesizer' | 'snowmaker' | 'smelter', definition: WeightedRefineryRecipeDefinitionV1): void;
  }

  export namespace processing {
    export import isEnabledAt = sharedStructures.processing.isEnabledAt

    export function register(id: string, definition: StructureProcessingDefinitionV1): void;
    export function setEnabledAt(...args: [...CellCoordinates, enabled: boolean]): boolean;
  }

  export interface StructureBuildMode {
    type: string;
    directions?: string[];
  }

  export interface StructureVariant {
    id: string | number;
    angles: number[];
  }

  export interface StructureRender {
    imageName?: string;
    size?: { width: number; height: number };
    offset?: { x: number; y: number };
  }

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

  export type StructureProcessorDefinitionV1 = unknown
  export type PlacementConfigDefinition = unknown
  export type PlanterBoxRecipeDefinitionV1 = unknown
  export type ShakerRecipeDefinitionV1 = unknown
  export type KineticPressRecipeDefinitionV1 = unknown
  export type WeightedRefineryRecipeDefinitionV1 = unknown
  export type StructureProcessingDefinitionV1 = unknown
}
