/**
 * Structure registration, queries, recipes, and idle mutations.
 *
 * Available as `sandkit.api.structures`.
 *
 * @module
 */
import { CellCoordinates, Vector2 } from "../../shared/player";
import { shared } from "../../shared";
// Aliased: `structures` declares a nested `processing` namespace that would
// otherwise shadow this import.
import { processing as processingApi } from "./processing";

export namespace structures {

  /** Call callback for each structure of the given type. */
  export import forEachOfType = shared.api.structures.forEachOfType;
  /** Return the structure at a cell, or null. */
  export import getAtCell = shared.api.structures.getAtCell;
  /** Return the definition for a structure type. */
  export import getDefinitionByType = shared.api.structures.getDefinitionByType;
  /** Resolve a string structure id to its type. */
  export import getTypeFromId = shared.api.structures.getTypeFromId;
  /** Return true when a built structure exists at the cell. */
  export import hasBuiltAtCell = shared.api.structures.hasBuiltAtCell;
  /** Return true when a structure matches a string id. */
  export import isType = shared.api.structures.isType;
  /** Return true when the cell structure matches a string id. */
  export import isTypeAtCell = shared.api.structures.isTypeAtCell;
  /** Set spritesheet index on a structure instance. */
  export import setSpritesheetIndex = shared.api.structures.setSpritesheetIndex;
  /** Set spritesheet index on the structure at a cell. */
  export import setSpritesheetIndexAtCell = shared.api.structures.setSpritesheetIndexAtCell;
  /** Map a value through thresholds to a spritesheet index on a structure. */
  export import setSpritesheetIndexByValue = shared.api.structures.setSpritesheetIndexByValue;
  /** Map a value through thresholds to a spritesheet index at a cell. */
  export import setSpritesheetIndexByValueAtCell = shared.api.structures.setSpritesheetIndexByValueAtCell;
  /** Push structure state updates to the game and workers. */
  export import update = shared.api.structures.update;
  /** Set partial data on a structure instance. */
  export import setData = shared.api.structures.setData;
  /** Structure instance in the world. */
  export import Structure = shared.api.structures.Structure;
  /** Structure type id or enum value. */
  export import StructureType = shared.api.structures.StructureType;
  /** Mod or built-in structure string id. */
  export import StructureId = shared.api.structures.StructureId;
  /** Type handle or string id accepted by lookup helpers. */
  export import StructureRef = shared.api.structures.StructureRef;

  /**
   * Register a structure processor handler.
   * @param structureId - Structure type or string id to attach the processor to.
   * @param definition - Periodic processing interval and callback.
   */
  export function addProcessor(structureId: StructureRef, definition: StructureProcessorDefinitionV1): void;

  /**
   * Register a new structure definition.
   * @param definition - Full structure definition.
   * @param options - When `useRawShape` is true, keep the shape matrix as-is.
   */
  export function register(definition: SandkitStructureDefinition, options?: { useRawShape?: boolean; }): void;

  /**
   * Patch fields on an existing structure definition.
   * @param structureTypeOrId - Structure type value or string id.
   * @param partial - Fields to merge onto the definition.
   * @param options - When `useRawShape` is true, keep the shape matrix as-is.
   */
  export function updateDefinition(structureTypeOrId: StructureRef, partial: Partial<SandkitStructureDefinition>, options?: { useRawShape?: boolean; }): void;

  /**
   * Add a rotated variant to a base structure type.
   * @param baseStructureTypeOrId - Base structure type or id.
   * @param variant - Variant id and supported rotation angles.
   * @param options - Optional build-mode wiring for the variant.
   */
  export function addVariant(baseStructureTypeOrId: StructureRef, variant: { id: StructureRef; angles: number[]; }, options?: { addBuildMode?: unknown; }): void;

  /**
   * Register placement rules for a structure.
   * @param definition - Hotbar placement field configuration.
   */
  export function registerPlacementConfig(definition: PlacementConfigDefinition): void;

  /** Return structure types unlocked for building. */
  export function getUnlockedTypes(): Set<StructureRef>;

  /**
   * Return true when the player blocks building at the cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function isBlockedByPlayerAtCell(...args: CellCoordinates): boolean;

  /**
   * Return true when a launcher structure is at the cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function isLauncherAtCell(...args: CellCoordinates): boolean;

  /**
   * Return true when a structure type is unlocked.
   * @param structureType - Structure type value or string id.
   */
  export function isUnlockedByType(structureType: StructureRef): boolean;

  /**
   * Map a numeric value through thresholds to a spritesheet index.
   * @param value - Numeric value to map.
   * @param thresholds - Ascending threshold values.
   * @returns Spritesheet frame index.
   */
  export function mapValueToSpritesheetIndex(value: number, thresholds: number[]): number;

  /**
   * Build a structure at a cell when simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param structureTypeOrId - Structure type or string id to build.
   * @param options - Optional build overrides.
   */
  export function buildAtCellWhenIdle(...args: [...CellCoordinates, structureTypeOrId: StructureRef, options?: StructureBuildOptions]): void;

  /**
   * Remove a structure at a cell when simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param options - Optional removal flags.
   */
  export function removeAtCellWhenIdle(...args: [...CellCoordinates, options?: StructureRemovalOptions]): void;

  /**
   * Remove structures between two cells when simulation is idle.
   * @param startCellX - Start cell column.
   * @param startCellY - Start cell row.
   * @param endCellX - End cell column.
   * @param endCellY - End cell row.
   * @param options - Optional bulk-removal flags.
   */
  export function removeBetweenCellsWhenIdle(startCellX: number, startCellY: number, endCellX: number, endCellY: number, options?: StructureBulkRemovalOptions): void;

  /**
   * Remove structures at many cells when simulation is idle.
   * @param positions - Cell positions to clear.
   * @param options - Optional bulk-removal flags.
   */
  export function removeAtCellsWhenIdle(positions: Vector2[], options?: StructureBulkRemovalOptions): void;

  /** Structure recipe registration by machine kind. */
  export namespace recipes {
    /**
     * Register a planter box recipe.
     * @param id - Machine recipe slot id.
     * @param definition - Grower recipe definition.
     */
    export function register(id: 'planterBox', definition: PlanterBoxRecipeDefinitionV1): void;

    /**
     * Register a shaker recipe.
     * @param id - Machine recipe slot id.
     * @param definition - Shaker recipe definition.
     */
    export function register(id: 'shaker', definition: ShakerRecipeDefinitionV1): void;

    /**
     * Register a kinetic press recipe.
     * @param id - Machine recipe slot id.
     * @param definition - Kinetic press recipe definition.
     */
    export function register(id: 'kineticPress', definition: KineticPressRecipeDefinitionV1): void;

    /**
     * Register a weighted refinery machine recipe.
     * @param id - Refinery machine id.
     * @param definition - Weighted input/output recipe.
     */
    export function register(id: 'condenser' | 'steamDryer' | 'synthesizer' | 'snowmaker' | 'smelter', definition: WeightedRefineryRecipeDefinitionV1): void;
  }

  /** Per-structure processing enablement and registration. */
  export namespace processing {
    /** Return true when processing is enabled at a cell. */
    export import isEnabledAt = shared.api.structures.processing.isEnabledAt;

    /**
     * Register a custom processing definition by id.
     * @param id - Unique processing registration id.
     * @param definition - Structure type, interval, and callback.
     */
    export function register(id: StructureId, definition: StructureProcessingDefinitionV1): void;

    /**
     * Enable or disable processing at a cell.
     * @param cellX - Grid column of the target cell.
     * @param cellY - Grid row of the target cell.
     * @param enabled - Desired processing enabled state.
     * @returns True when the enabled state changed.
     */
    export function setEnabledAt(...args: [...CellCoordinates, enabled: boolean]): boolean;
  }

  /** Build mode entry for a structure definition. */
  export interface StructureBuildMode {
    type: string;
    directions?: string[];
  }

  /** Rotated variant entry for a structure definition. */
  export interface StructureVariant {
    id: StructureRef;
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
    id: StructureId;
    nameKey?: string;
    descriptionKey?: string;
    categoryKey?: string;
    order?: number;
    buildModes?: StructureBuildMode[];
    shape?: number[][];
    variants?: StructureVariant[];
    render?: StructureRender;
    defaultData?: Record<string, unknown>;
    [key: string]: unknown;
  }

  /** Options passed to {@link buildAtCellWhenIdle}. */
  export interface StructureBuildOptions {
    [key: string]: unknown;
  }

  /** Options passed to {@link removeAtCellWhenIdle}. */
  export interface StructureRemovalOptions {
    /** Also remove underlying terrain cells in the footprint. */
    removeCells?: boolean;
    /** Skip visual teardown effects. */
    skipVisuals?: boolean;
  }

  /** Options passed to bulk structure removal helpers. */
  export interface StructureBulkRemovalOptions {
    removeCells?: boolean;
    skipVisuals?: boolean;
    /** When set, only remove structures at these positions. */
    preserveUnselectable?: boolean;
    onlyPositions?: Vector2[];
  }

  /** Periodic structure processor attached with {@link addProcessor}. */
  export interface StructureProcessorDefinitionV1 {
    /** Tick interval in milliseconds. Must be > 0. */
    intervalMs: number;
    /** Synchronous callback invoked for each structure instance. */
    process: (state: unknown, structure: Structure) => void;
  }

  /** Placement hotbar field definition. */
  export type PlacementConfigField =
    | PlacementConfigIntegerField
    | PlacementConfigChoiceField;

  /** Integer placement field with optional bounds. */
  export interface PlacementConfigIntegerField {
    type: "integer";
    id: string;
    labelKey: string;
    min?: number;
    max?: number;
    default?: number;
  }

  /** Choice placement field with labeled options. */
  export interface PlacementConfigChoiceField {
    type: "choice";
    id: string;
    labelKey: string;
    options: readonly {
      value: string;
      labelKey: string;
    }[];
  }

  /** Placement rule definition for a structure type. */
  export interface PlacementConfigDefinition {
    structureId: StructureId;
    fields: PlacementConfigField[];
  }

  /** Planter box recipe definition shape. */
  export type PlanterBoxRecipeDefinitionV1 = processingApi.PlanterBoxRecipeDefinitionV1;
  /** Shaker recipe definition shape. */
  export type ShakerRecipeDefinitionV1 = processingApi.ShakerRecipeDefinitionV1;
  /** Kinetic press recipe definition shape. */
  export type KineticPressRecipeDefinitionV1 = processingApi.KineticPressRecipeDefinitionV1;

  /** Weighted refinery recipe definition shape. */
  export interface WeightedRefineryRecipeDefinitionV1 {
    input: processingApi.WeightedRecipeOutput["elementType"];
    outputs: processingApi.WeightedRecipeOutput[];
  }

  /** Custom structure processing definition shape. */
  export interface StructureProcessingDefinitionV1 {
    structureType: StructureRef;
    intervalMs: number;
    process: (state: unknown, structure: Structure) => void;
  }
}
