import type { ApiHandler, DataBag, RegistrationDef, StructureCallback, StructureRef } from "../../common";

export interface StructureProcessingRegistration extends DataBag {
  structureType: string;
  intervalMs?: number;
  process: ApiHandler;
}

export interface StructureRecipeRegistration extends DataBag {
  input: unknown;
  output?: unknown;
  chance?: number;
  outputsAbove?: unknown[];
  outputsBelow?: unknown[];
  outputs?: unknown[];
  minimumDownwardVelocity?: number;
}

export interface StructuresApi {
  register(type: string, definition: RegistrationDef): void;
  updateDefinition(type: string, modId: string, patch: RegistrationDef): void;
  forEachOfType(type: string, fn: StructureCallback): void;
  getAtCell(x: number, y: number): StructureRef | null;
  setData(structure: StructureRef, data: DataBag): void;
  isType(structure: StructureRef, type: string): boolean;
  isTypeAtCell(x: number, y: number, type: string): boolean;
  buildAtCellWhenIdle(x: number, y: number, type: string, options?: DataBag): void;
  removeAtCellWhenIdle(x: number, y: number, options?: DataBag): void;
  removeAtCellsWhenIdle(positions: Array<{ x: number; y: number }>, options?: DataBag): void;
  removeBetweenCellsWhenIdle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: DataBag,
  ): void;
  addProcessor(type: string, processor: DataBag): void;
  addVariant(type: string, variantId: string, patch: RegistrationDef): void;
  getDefinitionByType(type: string): RegistrationDef | undefined;
  getTypeFromId(id: string): string | undefined;
  getUnlockedTypes(): string[];
  hasBuiltAtCell(x: number, y: number): boolean;
  isBlockedByPlayerAtCell(x: number, y: number): boolean;
  isLauncherAtCell(x: number, y: number): boolean;
  isUnlockedByType(type: string): boolean;
  mapValueToSpritesheetIndex(value: number, thresholds: number[]): number;
  registerPlacementConfig(config: DataBag): void;
  setSpritesheetIndex(structure: StructureRef, index: number): void;
  setSpritesheetIndexAtCell(x: number, y: number, index: number): void;
  setSpritesheetIndexByValue(structure: StructureRef, value: number, thresholds: number[]): void;
  setSpritesheetIndexByValueAtCell(x: number, y: number, value: number, thresholds: number[]): void;
  update(structure: StructureRef, patch: DataBag): void;
  processing: {
    register(type: string, definition: StructureProcessingRegistration): void;
    isEnabledAt(x: number, y: number): boolean;
    setEnabledAt(x: number, y: number, enabled: boolean): void;
  };
  recipes: {
    register(structureType: string, recipe: StructureRecipeRegistration): void;
  };
}
