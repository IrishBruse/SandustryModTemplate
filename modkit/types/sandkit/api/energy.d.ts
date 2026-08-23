import { CellCoordinates } from "../../shared/player";

export namespace energy {
  export function registerType(structureId: string, type: 'conductor' | 'storage', options?: any): void;
  export function addAtCell(...args: [CellCoordinates, amount: number, options?: any]): number;
  export function consume(amount: number, options?: {
    allOrNothing?: boolean;
  }): number;
  export function consumeExcludingNetworkAtCell(...args: [...CellCoordinates, amount: number]): number;
  export function getNetworkAtCell(...args: CellCoordinates): {
    x: number;
    y: number;
    type: string;
  }[];
  export function getNetworkFreeCapacityAtCell(...args: CellCoordinates): number;
}