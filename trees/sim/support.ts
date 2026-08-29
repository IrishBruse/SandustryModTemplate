import { CARDINAL_DIRS } from "./constants.ts";
import type { Cell } from "./cell.ts";

/** Prefer the cell below the seed, then other cardinal neighbors. */
export function preferSupportCell(seed: Cell, candidates: readonly Cell[]): Cell | null {
  const below = candidates.find((cell) => cell.x === seed.x && cell.y === seed.y + 1);
  if (below) return below;
  return candidates[0] ?? null;
}

export function cardinalNeighbors(cellX: number, cellY: number): Cell[] {
  return CARDINAL_DIRS.map(([dx, dy]) => ({ x: cellX + dx, y: cellY + dy }));
}
