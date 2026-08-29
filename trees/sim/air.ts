import { ORTHO8_DIRS } from "./constants.ts";

export function countAdjacentAir(
  isEmpty: (cellX: number, cellY: number) => boolean,
  cellX: number,
  cellY: number,
): number {
  let count = 0;
  for (const [dx, dy] of ORTHO8_DIRS) {
    if (isEmpty(cellX + dx, cellY + dy)) count += 1;
  }
  return count;
}
