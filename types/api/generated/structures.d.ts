/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Structure registration and mutation
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiStructures {
  /**
   * Add processor.
   * @param structureId structure id.
   * @param definition Registration definition object.
   */
  addProcessor: (structureId: string | StructureType, definition: StructureProcessorDefinitionV1) => void;
  /**
   * Add variant.
   * @param baseStructureTypeOrId base Structure Type Or id.
   * @param variant variant.
   * @param options Optional settings object.
   */
  addVariant: (baseStructureTypeOrId: string | StructureType, variant: { id: string | StructureType; angles: number[]; }, options?: { addBuildMode?: unknown; }) => void;
  /**
   * Build at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param structureTypeOrId structure Type Or id.
   * @param options Optional settings object.
   */
  buildAtCellWhenIdle: (cellX: number, cellY: number, structureTypeOrId: string, options?: unknown) => void;
  /**
   * Iterate of type.
   * @param structureTypeOrId structure Type Or id.
   * @param callback Callback function.
   */
  forEachOfType: (structureTypeOrId: string | StructureType, callback: (structure: Structure) => void) => void;
  /**
   * Return at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getAtCell: (cellX: number, cellY: number) => Structure | null;
  /**
   * Return definition by type.
   * @param structureType structure Type string.
   */
  getDefinitionByType: (structureType: string | StructureType) => unknown;
  /**
   * Return type from id.
   * @param structureId structure id.
   */
  getTypeFromId: (structureId: string) => string | StructureType;
  /** Return unlocked types. */
  getUnlockedTypes: () => Set<string | StructureType>;
  /**
   * Return whether built at cell exists.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  hasBuiltAtCell: (cellX: number, cellY: number) => boolean;
  /**
   * Return whether blocked by player at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isBlockedByPlayerAtCell: (cellX: number, cellY: number) => boolean;
  /**
   * Return whether launcher at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isLauncherAtCell: (cellX: number, cellY: number) => boolean;
  /**
   * Return whether type.
   * @param structureId structure id.
   */
  isType: (structure: Structure | null, structureId: string) => boolean;
  /**
   * Return whether type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param structureId structure id.
   */
  isTypeAtCell: (cellX: number, cellY: number, structureId: string) => boolean;
  /**
   * Return whether unlocked by type.
   * @param structureType structure Type string.
   */
  isUnlockedByType: (structureType: string | StructureType) => boolean;
  /**
   * Return number.
   * @param value value.
   * @param thresholds thresholds.
   */
  mapValueToSpritesheetIndex: (value: number, thresholds: number[]) => number;
  processing: ApiStructuresProcessing;
  recipes: ApiStructuresRecipes;
  /**
   * Register a definition.
   * @param definition Registration definition object.
   * @param options Optional settings object.
   */
  register: (definition: SandkitStructureDefinition, options?: { useRawShape?: boolean; }) => void;
  /**
   * Register placement config.
   * @param definition Registration definition object.
   */
  registerPlacementConfig: (definition: PlacementConfigDefinition) => void;
  /**
   * Remove at cells when idle.
   * @param positions positions.
   * @param options Optional settings object.
   */
  removeAtCellsWhenIdle: (positions: { x: number; y: number; }[], options?: { removeCells?: boolean; skipVisuals?: boolean; }) => void;
  /**
   * Remove at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param options Optional settings object.
   */
  removeAtCellWhenIdle: (cellX: number, cellY: number, options?: { removeCells?: boolean; skipVisuals?: boolean; }) => void;
  /**
   * Remove between cells when idle.
   * @param startCellX Cell X coordinate.
   * @param startCellY Cell Y coordinate.
   * @param endCellX Cell X coordinate.
   * @param endCellY Cell Y coordinate.
   * @param options Optional settings object.
   */
  removeBetweenCellsWhenIdle: (startCellX: number, startCellY: number, endCellX: number, endCellY: number, options?: { removeCells?: boolean; preserveUnselectable?: boolean; onlyPositions?: { x: number; y: number; }[]; }) => void;
  /**
   * Set data.
   * @param partial Optional settings object.
   * @param options Optional settings object.
   */
  setData: (structure: Structure, partial: unknown, options?: { propagateToWorkers?: boolean; }) => void;
  /**
   * Set spritesheet index.
   * @param index index.
   */
  setSpritesheetIndex: (structure: Structure, index: number) => void;
  /**
   * Set spritesheet index at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param index index.
   */
  setSpritesheetIndexAtCell: (cellX: number, cellY: number, index: number) => void;
  /**
   * Set spritesheet index by value.
   * @param value value.
   * @param thresholds thresholds.
   */
  setSpritesheetIndexByValue: (structure: Structure, value: number, thresholds: number[]) => void;
  /**
   * Set spritesheet index by value at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param value value.
   * @param thresholds thresholds.
   */
  setSpritesheetIndexByValueAtCell: (cellX: number, cellY: number, value: number, thresholds: number[]) => void;
  /**
   * Update a definition.
   * @param options Optional settings object.
   */
  update: (structure: Structure, options?: { propagateToWorkers?: boolean; }) => void;
  /**
   * Update definition.
   * @param structureTypeOrId structure Type Or id.
   * @param partial Optional settings object.
   * @param options Optional settings object.
   */
  updateDefinition: (structureTypeOrId: string | StructureType, partial: Partial<SandkitStructureDefinition>, options?: { useRawShape?: boolean; }) => void;
}
export interface ApiStructuresProcessing {
  /**
   * Return whether enabled at.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isEnabledAt: (cellX: number, cellY: number) => boolean;
  /**
   * Register a definition.
   * @param id id id.
   * @param definition Registration definition object.
   */
  register: (id: string, definition: StructureProcessingDefinitionV1) => void;
  /**
   * Set enabled at.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param enabled enabled flag.
   */
  setEnabledAt: (cellX: number, cellY: number, enabled: boolean) => boolean;
}
export interface ApiStructuresRecipes {
  /**
   * Register a definition.
   * @param id id id.
   * @param definition Registration definition object.
   */
  register: (id: 'planterBox', definition: PlanterBoxRecipeDefinitionV1) => void;
}
export type ApiStructuresNamespace = ApiStructures;
