import { CellCoordinates } from "../../shared/player";

/**
 * Shared `sandkit.api.structures` base — structure lookup and mutation.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace structures {
  /** Invoke a callback for every structure of the given type. */
  export function forEachOfType(structureTypeOrId: string | StructureType, callback: (structure: Structure) => void): void;
  /** Structure at a cell, or null when none. */
  export function getAtCell(...args: CellCoordinates): Structure | null;
  /** Mod-registered or built-in structure definition by type. */
  export function getDefinitionByType(structureType: string | StructureType): any;
  /** Map a structure string id to its type value. */
  export function getTypeFromId(structureId: string): string | StructureType;
  /** True when a completed structure occupies the cell. */
  export function hasBuiltAtCell(...args: CellCoordinates): boolean;
  /** True when the structure matches the given id. */
  export function isType(structure: Structure | null, structureId: string): boolean;
  /** True when the cell structure matches the given id. */
  export function isTypeAtCell(...args: [...CellCoordinates, structureId: string]): boolean;
  /** Set the spritesheet frame index on a structure instance. */
  export function setSpritesheetIndex(structure: Structure, index: number): void;
  /** Set spritesheet frame index for the structure at a cell. */
  export function setSpritesheetIndexAtCell(...args: [...CellCoordinates, index: number]): void;
  /** Pick spritesheet index from a value and threshold table. */
  export function setSpritesheetIndexByValue(structure: Structure, value: number, thresholds: number[]): void;
  /** Same as {@link setSpritesheetIndexByValue} for the structure at a cell. */
  export function setSpritesheetIndexByValueAtCell(...args: [...CellCoordinates, value: number, thresholds: number[]]): void;
  /** Push structure field changes to simulation (optionally to workers). */
  export function update(structure: Structure, options?: { propagateToWorkers?: boolean; }): void;
  /** Merge partial data onto a structure (optionally propagate to workers). */
  export function setData(structure: Structure, partial: any, options?: { propagateToWorkers?: boolean; }): void;

  export namespace processing {
    /** True when processing is enabled at the cell. */
    export function isEnabledAt(...args: CellCoordinates): boolean;
  }

  /** Per-structure custom data bag. */
  export interface StructureData {
    elementId?: string | null;
    elementType?: number | null;
    [key: string]: unknown;
  }

  /** Live structure instance in the world grid. */
  export interface Structure {
    x: number;
    y: number;
    trapped?: boolean;
    data?: StructureData;
    [key: string]: unknown;
  }

  /** Numeric or string structure type discriminator. */
  export type StructureType = string | number
}
