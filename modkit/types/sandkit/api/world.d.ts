import { CellCoordinates } from "../../shared/player"
import { world as sharedWorld } from "../../shared/api/world"

export namespace world {

  export import getCellIdAtCell = sharedWorld.getCellIdAtCell
  export import isCellEmptyAtCell = sharedWorld.isCellEmptyAtCell
  export import isTerrainAtCell = sharedWorld.isTerrainAtCell
  export import reportActivityAtCell = sharedWorld.reportActivityAtCell
  export import excavateAtCell = sharedWorld.excavateAtCell
  export import ExcavateOptions = sharedWorld.ExcavateOptions


  export function runWhenSimulationIdle(callback: () => void): void;
  export function revealFogAtCell(...args: CellCoordinates): void;
  export function redrawAroundCellWhenIdle(...args: [...CellCoordinates, range: number]): void;

  export namespace pickups {
    export function spawnAtWorld(type: WorldItemType, worldX: number, worldY: number, data?: any, light?: WorldItemLight): any;
    export function destroy(worldItem: any): void;
    export function pickUp(worldItem: any): boolean;
    export function getAll(): any[];
    export function getById(worldItemId: number): any;
  }

  export type WorldItemType = unknown
  export type WorldItemLight = unknown
}