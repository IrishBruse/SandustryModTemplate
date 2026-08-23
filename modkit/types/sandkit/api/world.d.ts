/**
 * World cell queries, excavation, fog, redraw, and pickups.
 *
 * Available as `sandkit.api.world`.
 *
 * @module
 */
import { CellCoordinates } from "../../shared/player"
import { world as sharedWorld } from "../../shared/api/world"

export namespace world {

  /** Return cell id at a grid cell. */
  export import getCellIdAtCell = sharedWorld.getCellIdAtCell
  /** Return true when the cell is empty. */
  export import isCellEmptyAtCell = sharedWorld.isCellEmptyAtCell
  /** Return true when the cell holds terrain. */
  export import isTerrainAtCell = sharedWorld.isTerrainAtCell
  /** Mark a cell as active for simulation this tick. */
  export import reportActivityAtCell = sharedWorld.reportActivityAtCell
  /** Excavate at a cell with output velocity and damage. */
  export import excavateAtCell = sharedWorld.excavateAtCell
  /** Options for excavateAtCell. */
  export import ExcavateOptions = sharedWorld.ExcavateOptions

  /** Run a callback when simulation is idle. */
  export function runWhenSimulationIdle(callback: () => void): void;
  /** Reveal fog of war at a cell. */
  export function revealFogAtCell(...args: CellCoordinates): void;
  /** Request redraw around a cell when simulation is idle. */
  export function redrawAroundCellWhenIdle(...args: [...CellCoordinates, range: number]): void;

  /** World item spawn, pickup, and lookup. */
  export namespace pickups {
    /** Spawn a world pickup at world position. */
    export function spawnAtWorld(type: WorldItemType, worldX: number, worldY: number, data?: any, light?: WorldItemLight): any;
    /** Destroy a world pickup instance. */
    export function destroy(worldItem: any): void;
    /** Pick up a world item into inventory. Return true when picked up. */
    export function pickUp(worldItem: any): boolean;
    /** Return all active world pickups. */
    export function getAll(): any[];
    /** Return a world pickup by numeric id. */
    export function getById(worldItemId: number): any;
  }

  /** World pickup type discriminator. */
  export type WorldItemType = unknown
  /** Optional light settings for a spawned pickup. */
  export type WorldItemLight = unknown
}
