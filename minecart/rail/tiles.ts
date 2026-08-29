import { TILE_CELLS } from "../constants.ts";

export type TileKind = "rail" | "rampRiseRight" | "rampRiseLeft";

export type Cell = { x: number; y: number };

const STEP = TILE_CELLS;

const NEAR: Cell[] = [
  { x: -STEP, y: 0 },
  { x: STEP, y: 0 },
  { x: 0, y: -STEP },
  { x: 0, y: STEP },
  { x: -STEP, y: -STEP },
  { x: STEP, y: -STEP },
  { x: -STEP, y: STEP },
  { x: STEP, y: STEP },
];

export function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function snapTile(cellX: number, cellY: number): Cell {
  return {
    x: Math.floor(cellX / STEP) * STEP,
    y: Math.floor(cellY / STEP) * STEP,
  };
}

/** World Y grows downward. Rise tiles climb toward smaller Y (surface). */
export function connections(kind: TileKind, x: number, y: number): Cell[] {
  switch (kind) {
    case "rail":
      return [
        { x: x - STEP, y },
        { x: x + STEP, y },
      ];
    case "rampRiseRight":
      return [
        { x: x - STEP, y },
        { x: x + STEP, y: y - STEP },
      ];
    case "rampRiseLeft":
      return [
        { x: x + STEP, y },
        { x: x - STEP, y: y - STEP },
      ];
  }
}

export function linkedCells(x: number, y: number, tiles: Map<string, TileKind>): Cell[] {
  const self = tiles.get(cellKey(x, y));
  if (!self) return [];

  const out = new Map<string, Cell>();
  for (const next of connections(self, x, y)) {
    if (tiles.has(cellKey(next.x, next.y))) out.set(cellKey(next.x, next.y), next);
  }
  for (const delta of NEAR) {
    const nx = x + delta.x;
    const ny = y + delta.y;
    const kind = tiles.get(cellKey(nx, ny));
    if (!kind) continue;
    const linksHere = connections(kind, nx, ny).some((cell) => cell.x === x && cell.y === y);
    if (linksHere) out.set(cellKey(nx, ny), { x: nx, y: ny });
  }
  return [...out.values()];
}
