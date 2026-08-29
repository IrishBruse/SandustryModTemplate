import { type Cell, cellKey } from "../rail/tiles.ts";

export type StepResult = {
  cell: Cell;
  lastDx: number;
  lastDy: number;
  wait: boolean;
};

function sameCell(a: Cell, b: Cell): boolean {
  return a.x === b.x && a.y === b.y;
}

function pickPreferred(
  forward: Cell[],
  pos: Cell,
  lastDx: number,
  lastDy: number,
): Cell | undefined {
  return forward.find((cell) => {
    if (lastDx !== 0 && Math.sign(cell.x - pos.x) === Math.sign(lastDx)) return true;
    if (lastDy !== 0 && Math.sign(cell.y - pos.y) === Math.sign(lastDy)) return true;
    return false;
  });
}

/**
 * Pick the next rail cell. Prefer continuing away from the last cell.
 * Wait when the forward cell is occupied. Reverse only at a true dead end.
 */
export function nextStep(
  pos: Cell,
  lastDx: number,
  lastDy: number,
  linked: Cell[],
  occupied: Set<string>,
): StepResult {
  const hasHeading = lastDx !== 0 || lastDy !== 0;
  const back = hasHeading ? { x: pos.x - lastDx, y: pos.y - lastDy } : null;
  const open = linked.filter((cell) => !occupied.has(cellKey(cell.x, cell.y)));

  if (!hasHeading) {
    if (open.length === 0) return { cell: pos, lastDx, lastDy, wait: true };
    const cell = open.find((item) => item.x > pos.x) ?? open[0];
    return { cell, lastDx: cell.x - pos.x, lastDy: cell.y - pos.y, wait: false };
  }

  const forward = back ? linked.filter((cell) => !sameCell(cell, back)) : linked;
  const openForward = forward.filter((cell) => !occupied.has(cellKey(cell.x, cell.y)));

  if (openForward.length === 1) {
    const cell = openForward[0];
    return { cell, lastDx: cell.x - pos.x, lastDy: cell.y - pos.y, wait: false };
  }

  if (openForward.length > 1) {
    const preferred = pickPreferred(openForward, pos, lastDx, lastDy);
    if (!preferred) return { cell: pos, lastDx, lastDy, wait: true };
    return {
      cell: preferred,
      lastDx: preferred.x - pos.x,
      lastDy: preferred.y - pos.y,
      wait: false,
    };
  }

  if (forward.length > 0) {
    return { cell: pos, lastDx, lastDy, wait: true };
  }

  if (back && open.some((cell) => sameCell(cell, back))) {
    return { cell: back, lastDx: back.x - pos.x, lastDy: back.y - pos.y, wait: false };
  }

  return { cell: pos, lastDx, lastDy, wait: true };
}
