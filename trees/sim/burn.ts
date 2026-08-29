import { countAdjacentAir } from "./air.ts";
import type { TreeTypes } from "./types.ts";

export function burnRawWood(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
  context: { cancel(): void },
): void {
  const air = countAdjacentAir((x, y) => api.grid.isCellEmptyAtCell(x, y), cellX, cellY);
  if (air > 0) return;
  context.cancel();
  api.elements.replaceAtCell(cellX, cellY, types.charcoal);
  api.grid.reportActivityAtCell(cellX, cellY);
}
