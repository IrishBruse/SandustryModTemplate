import {
  CANOPY_MAX_HALF_WIDTH,
  CANOPY_ROWS,
  CANOPY_TIP_OFFSET_CELLS,
  TRUNK_HALF_WIDTH,
  TRUNK_HEIGHT,
} from "./constants.ts";

/** Needles on each side of the trunk. Row 0 is just below the tip (narrow). */
export function canopyHalfWidth(rowFromTop: number): number {
  if (rowFromTop <= 0) return 1;
  if (CANOPY_ROWS <= 1) return CANOPY_MAX_HALF_WIDTH;
  const t = Math.min(rowFromTop, CANOPY_ROWS - 1) / (CANOPY_ROWS - 1);
  return 1 + Math.round(t * (CANOPY_MAX_HALF_WIDTH - 1));
}

export function canopyTreeTopY(rootY: number): number {
  return rootY - (TRUNK_HEIGHT - 1);
}

/** Center needle above the top trunk row. */
export function canopyTipY(rootY: number): number {
  return canopyTreeTopY(rootY) - CANOPY_TIP_OFFSET_CELLS;
}

/** Needle cells for one canopy row. Skips trunk columns. The cone fills above the wood. */
export function canopyRowCells(
  rootX: number,
  rootY: number,
  rowFromTop: number,
): { x: number; y: number }[] {
  const cellY = canopyTipY(rootY) + 1 + rowFromTop;
  const half = canopyHalfWidth(rowFromTop);
  const onTrunk = cellY >= canopyTreeTopY(rootY);
  const cells: { x: number; y: number }[] = [];
  for (let dx = -half; dx <= half; dx += 1) {
    if (onTrunk && Math.abs(dx) <= TRUNK_HALF_WIDTH) continue;
    cells.push({ x: rootX + dx, y: cellY });
  }
  return cells;
}
