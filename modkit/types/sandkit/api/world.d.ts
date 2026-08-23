/**
 * World cell queries, excavation, fog, redraw, and pickups.
 *
 * Available as `sandkit.api.world`.
 *
 * @module
 */
import { CellCoordinates } from "../../shared/player";
import { shared } from "../../shared";
import type { WorldItemType as WorldItemTypeEnum } from "../enums/index";

export namespace world {

  /** Return cell id at a grid cell. */
  export import getCellIdAtCell = shared.api.world.getCellIdAtCell;
  /** Return true when the cell is empty. */
  export import isCellEmptyAtCell = shared.api.world.isCellEmptyAtCell;
  /** Return true when the cell holds terrain. */
  export import isTerrainAtCell = shared.api.world.isTerrainAtCell;
  /** Mark a cell as active for simulation this tick. */
  export import reportActivityAtCell = shared.api.world.reportActivityAtCell;
  /** Excavate at a cell with output velocity and damage. */
  export import excavateAtCell = shared.api.world.excavateAtCell;
  /** Options for {@link excavateAtCell}. */
  export import ExcavateOptions = shared.api.world.ExcavateOptions;

  /**
   * Run a callback when simulation is idle.
   * @param callback - Function invoked on the main thread when workers are idle.
   */
  export function runWhenSimulationIdle(callback: () => void): void;

  /**
   * Reveal fog of war at a cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function revealFogAtCell(...args: CellCoordinates): void;

  /**
   * Request redraw around a cell when simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param range - Radius in cells to redraw.
   */
  export function redrawAroundCellWhenIdle(...args: [...CellCoordinates, range: number]): void;

  /** World item spawn, pickup, and lookup. */
  export namespace pickups {
    /**
     * Spawn a world pickup at world position.
     * @param type - Pickup type discriminator.
     * @param worldX - World x position in pixels.
     * @param worldY - World y position in pixels.
     * @param data - Optional per-item data bag copied onto the instance.
     * @param light - Optional point light spawned with the pickup.
     * @returns The spawned world item instance.
     */
    export function spawnAtWorld(type: WorldItemType, worldX: number, worldY: number, data?: Record<string, unknown>, light?: WorldItemLight): WorldItem;

    /**
     * Destroy a world pickup instance.
     * @param worldItem - World item returned from spawn or lookup helpers.
     */
    export function destroy(worldItem: WorldItem): void;

    /**
     * Pick up a world item into inventory.
     * @param worldItem - World item to pick up.
     * @returns True when the item was collected.
     */
    export function pickUp(worldItem: WorldItem): boolean;

    /** Return all active world pickups. */
    export function getAll(): WorldItem[];

    /**
     * Return a world pickup by numeric id.
     * @param worldItemId - Runtime world item id.
     */
    export function getById(worldItemId: number): WorldItem | undefined;
  }

  /** World pickup type discriminator. */
  export type WorldItemType = WorldItemTypeEnum;

  /** Optional point light attached when spawning a pickup. */
  export interface WorldItemLight {
    /** Light brightness multiplier. Default 1. */
    brightness?: number;
    /** Light radius in world pixels. Default 100. */
    size?: number;
    /** RGB or RGBA color components in 0–1 range. */
    color?: [number, number, number] | [number, number, number, number];
  }

  /** Active world pickup instance. */
  export interface WorldItem {
    id: number;
    x: number;
    y: number;
    type: WorldItemType;
    data: Record<string, unknown>;
  }
}
