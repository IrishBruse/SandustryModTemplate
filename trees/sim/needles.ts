import { CARDINAL_DIRS, COMPOST_REST_TICKS, FIELD, MECHANICAL_SPEED } from "./constants.ts";
import type { TreeTypes } from "./types.ts";

function neighborIsFire(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
): boolean {
  for (const [dx, dy] of CARDINAL_DIRS) {
    const type = api.elements.getResolvedTypeAtCell(cellX + dx, cellY + dy);
    if (type === types.fire || type === types.flame) return true;
  }
  return false;
}

function neighborIsMechanical(api: WorkerSandkitApi, cellX: number, cellY: number): boolean {
  for (const [dx, dy] of CARDINAL_DIRS) {
    const nx = cellX + dx;
    const ny = cellY + dy;
    if (!api.elements.isFreeFallingAtCell(nx, ny)) continue;
    const velocity = api.elements.getVelocityAtCell(nx, ny);
    if (!velocity) continue;
    if (Math.abs(velocity.x) >= MECHANICAL_SPEED || Math.abs(velocity.y) >= MECHANICAL_SPEED) {
      return true;
    }
  }
  return false;
}

function dropLeafDust(api: WorkerSandkitApi, types: TreeTypes, cellX: number, cellY: number): void {
  api.elements.replaceAtCell(cellX, cellY, types.leafDust, { isFreeFalling: true });
  api.grid.reportActivityAtCell(cellX, cellY);
}

export function breakPineNeedle(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
): void {
  if (neighborIsFire(api, types, cellX, cellY) || neighborIsMechanical(api, cellX, cellY)) {
    dropLeafDust(api, types, cellX, cellY);
  }
}

export function compostLeafDust(api: WorkerSandkitApi, cellX: number, cellY: number): void {
  if (api.elements.isFreeFallingAtCell(cellX, cellY)) {
    api.elements.setDataFieldAtCell(cellX, cellY, FIELD.rootX, 0);
    return;
  }
  const rest = (api.elements.getDataFieldAtCell(cellX, cellY, FIELD.rootX) ?? 0) + 1;
  if (rest < COMPOST_REST_TICKS) {
    api.elements.setDataFieldAtCell(cellX, cellY, FIELD.rootX, rest);
    return;
  }
  api.elements.removeAtCell(cellX, cellY);
  api.terrains.createAtCell(cellX, cellY, sandkit.enums.CellType.Dirt);
  api.grid.reportActivityAtCell(cellX, cellY);
}
