import { CellCoordinates } from "../../shared/player";

export namespace structures {
  export function forEachOfType(structureTypeOrId: string | StructureType, callback: (structure: Structure) => void): void;
  export function getAtCell(...args: CellCoordinates): Structure | null;
  export function getDefinitionByType(structureType: string | StructureType): any;
  export function getTypeFromId(structureId: string): string | StructureType;
  export function hasBuiltAtCell(...args: CellCoordinates): boolean;
  export function isType(structure: Structure | null, structureId: string): boolean;
  export function isTypeAtCell(...args: [...CellCoordinates, structureId: string]): boolean;
  export function setSpritesheetIndex(structure: Structure, index: number): void;
  export function setSpritesheetIndexAtCell(...args: [...CellCoordinates, index: number]): void;
  export function setSpritesheetIndexByValue(structure: Structure, value: number, thresholds: number[]): void;
  export function setSpritesheetIndexByValueAtCell(...args: [...CellCoordinates, value: number, thresholds: number[]]): void;
  export function update(structure: Structure, options?: { propagateToWorkers?: boolean; }): void;
  export function setData(structure: Structure, partial: any, options?: { propagateToWorkers?: boolean; }): void;

  export namespace processing {
    export function isEnabledAt(...args: CellCoordinates): boolean;
  }

  export interface StructureData {
    elementId?: string | null;
    elementType?: number | null;
    [key: string]: unknown;
  }

  export interface Structure {
    x: number;
    y: number;
    trapped?: boolean;
    data?: StructureData;
    [key: string]: unknown;
  }

  export type StructureType = string | number
}
