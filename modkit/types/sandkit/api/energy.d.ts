import { CellCoordinates } from "../../shared/player";

/**
 * `sandkit.api.energy` — structure energy networks, storage, and consumption.
 * Main thread only.
 */
export namespace energy {
  /** Registers an energy type on a structure as conductor or storage. */
  export function registerType(structureId: string, type: 'conductor' | 'storage', options?: any): void;
  /** Adds energy at a cell. Returns the amount actually added. */
  export function addAtCell(...args: [CellCoordinates, amount: number, options?: any]): number;
  /** Consumes energy from the global pool. Returns the amount consumed. */
  export function consume(amount: number, options?: {
    allOrNothing?: boolean;
  }): number;
  /** Consumes energy from networks other than the one at the cell. */
  export function consumeExcludingNetworkAtCell(...args: [...CellCoordinates, amount: number]): number;
  /** Returns energy network nodes connected at the cell. */
  export function getNetworkAtCell(...args: CellCoordinates): {
    x: number;
    y: number;
    type: string;
  }[];
  /** Returns free storage capacity in the network at the cell. */
  export function getNetworkFreeCapacityAtCell(...args: CellCoordinates): number;
}
