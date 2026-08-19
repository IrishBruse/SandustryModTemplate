import type { ApiHandler, DataBag } from "../../common";

export interface WorldPickupRef {
  id: number;
  x: number;
  y: number;
  [key: string]: unknown;
}

export interface WorldPickupsApi {
  destroy(id: number): void;
  getAll(): WorldPickupRef[];
  getById(id: number): WorldPickupRef | null;
  pickUp(id: number): void;
  spawnAtWorld(x: number, y: number, type: string, options?: DataBag, data?: DataBag): number;
}

export interface WorldApi {
  isCellEmptyAtCell(x: number, y: number): boolean;
  getCellIdAtCell(x: number, y: number): number;
  isTerrainAtCell(x: number, y: number): boolean;
  runWhenSimulationIdle(fn: () => void): void;
  excavateAtCell(x: number, y: number, radius: number, profile: unknown, options?: DataBag): void;
  revealFogAtCell(x: number, y: number): void;
  reportActivityAtCell(x: number, y: number): void;
  redrawAroundCellWhenIdle(x: number, y: number, radius: number): void;
  pickups: WorldPickupsApi;
}
