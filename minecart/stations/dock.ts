import { STATION_SIZE, TILE_CELLS } from "../constants.ts";
import type { Cell } from "../rail/tiles.ts";

function cellsEqual(cartX: number, cartY: number, docks: Cell[]): boolean {
  return docks.some((dock) => dock.x === cartX && dock.y === cartY);
}

/** Rail under the hopper. */
export function loaderDockCell(structureX: number, structureY: number): Cell {
  return { x: structureX, y: structureY + STATION_SIZE };
}

/** Hopper above the rail, or the hopper origin when it sits on the rail. */
export function loaderDockCells(structureX: number, structureY: number): Cell[] {
  return [loaderDockCell(structureX, structureY), { x: structureX, y: structureY }];
}

export function cartIsAtLoader(
  cartX: number,
  cartY: number,
  structureX: number,
  structureY: number,
): boolean {
  return cellsEqual(cartX, cartY, loaderDockCells(structureX, structureY));
}

/** Rail above the dump pad. */
export function unloaderDockCell(structureX: number, structureY: number): Cell {
  return { x: structureX, y: structureY - TILE_CELLS };
}

/** Dump pad under the rail, or the pad origin when it sits on the rail. */
export function unloaderDockCells(structureX: number, structureY: number): Cell[] {
  return [unloaderDockCell(structureX, structureY), { x: structureX, y: structureY }];
}

export function cartIsAtUnloader(
  cartX: number,
  cartY: number,
  structureX: number,
  structureY: number,
): boolean {
  return cellsEqual(cartX, cartY, unloaderDockCells(structureX, structureY));
}

export function stationFootprintCells(structureX: number, structureY: number): Cell[] {
  const cells: Cell[] = [];
  for (let dy = 0; dy < STATION_SIZE; dy += 1) {
    for (let dx = 0; dx < STATION_SIZE; dx += 1) {
      cells.push({ x: structureX + dx, y: structureY + dy });
    }
  }
  return cells;
}

/** Pile on top of the hopper, then the footprint, then the rail under it. */
export function stationIntakeCells(structureX: number, structureY: number): Cell[] {
  const cells: Cell[] = [];
  for (let dy = 1; dy <= TILE_CELLS * 2; dy += 1) {
    for (let dx = 0; dx < STATION_SIZE; dx += 1) {
      cells.push({ x: structureX + dx, y: structureY - dy });
    }
  }
  cells.push(...stationFootprintCells(structureX, structureY));
  for (let dy = 0; dy < TILE_CELLS; dy += 1) {
    for (let dx = 0; dx < STATION_SIZE; dx += 1) {
      cells.push({ x: structureX + dx, y: structureY + STATION_SIZE + dy });
    }
  }
  return cells;
}

/** Empty cells under the solid dump pad, toward belts. */
export function stationOutputCells(structureX: number, structureY: number): Cell[] {
  const cells: Cell[] = [];
  for (let dy = 0; dy < TILE_CELLS * 2; dy += 1) {
    for (let dx = 0; dx < STATION_SIZE; dx += 1) {
      cells.push({ x: structureX + dx, y: structureY + STATION_SIZE + dy });
    }
  }
  return cells;
}

/**
 * One empty cell per column, at the highest free row under the pad.
 * X may vary. Y stays on that top free row so cargo does not spawn in mid-air.
 */
export function pickUnloadCell(
  structureX: number,
  structureY: number,
  isEmpty: (x: number, y: number) => boolean,
  rand: () => number = Math.random,
): Cell | null {
  const top: Cell[] = [];
  for (let dx = 0; dx < STATION_SIZE; dx += 1) {
    for (let dy = 0; dy < TILE_CELLS * 2; dy += 1) {
      const x = structureX + dx;
      const y = structureY + STATION_SIZE + dy;
      if (!isEmpty(x, y)) continue;
      top.push({ x, y });
      break;
    }
  }
  if (top.length === 0) return null;
  return top[Math.floor(rand() * top.length)] ?? null;
}
