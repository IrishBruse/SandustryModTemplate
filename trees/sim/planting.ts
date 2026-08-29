import { FIELD, GROW_DURATION_TICKS, PHASE } from "./constants.ts";
import {
  cellFromArgs,
  collidedAtFromArgs,
  collidedElementTypeFromArgs,
  destinationFromArgs,
  sourceFromArgs,
} from "./cell.ts";
import { cardinalNeighbors, preferSupportCell } from "./support.ts";
import { forEachTrunkColumn } from "./trunk.ts";
import type { TreeTypes } from "./types.ts";

export function placeTrunkRow(
  api: WorkerSandkitApi,
  types: TreeTypes,
  rootX: number,
  cellY: number,
): void {
  forEachTrunkColumn(rootX, (cellX) => {
    if (!api.grid.isCellEmptyAtCell(cellX, cellY)) return;
    api.terrains.createAtCell(cellX, cellY, types.pineWood);
    api.grid.reportActivityAtCell(cellX, cellY);
  });
}

export function plantSeedOnWetSand(
  api: WorkerSandkitApi,
  types: TreeTypes,
  seedX: number,
  seedY: number,
  wetX: number,
  wetY: number,
): boolean {
  if (!api.elements.isTypeAtCell(seedX, seedY, types.pineSeed)) return false;
  if (!api.elements.isTypeAtCell(wetX, wetY, types.wetSand)) return false;
  api.elements.replaceAtCell(wetX, wetY, types.sand);
  api.elements.removeAtCell(seedX, seedY);
  placeTrunkRow(api, types, seedX, seedY);
  const shootY = seedY - 1;
  if (api.grid.isCellEmptyAtCell(seedX, shootY)) {
    api.elements.createAtCell(seedX, shootY, types.pineShoot, {
      durationTicks: GROW_DURATION_TICKS,
      dataFields: {
        field1: seedX,
        field2: seedY,
        field3: 1,
        field4: PHASE.growingTrunk,
      },
    });
    api.grid.reportActivityAtCell(seedX, shootY);
  }
  api.grid.reportActivityAtCell(seedX, seedY);
  api.grid.reportActivityAtCell(wetX, wetY);
  return true;
}

export function plantPineSeedFromBlocked(
  api: WorkerSandkitApi,
  types: TreeTypes,
  args: Record<string, unknown>,
  context: { cancel(): void },
): void {
  const seed = cellFromArgs(args);
  const hit = collidedAtFromArgs(args);
  if (!seed || !hit) return;
  if (collidedElementTypeFromArgs(args) !== types.wetSand) return;
  if (!plantSeedOnWetSand(api, types, seed.x, seed.y, hit.x, hit.y)) return;
  context.cancel();
}

export function plantPineSeedFromMove(
  api: WorkerSandkitApi,
  types: TreeTypes,
  args: Record<string, unknown>,
  context: { cancel(): void },
): void {
  const seed = sourceFromArgs(args);
  const dest = destinationFromArgs(args);
  if (!seed || !dest) return;
  if (!plantSeedOnWetSand(api, types, seed.x, seed.y, dest.x, dest.y)) return;
  context.cancel();
}

export function plantPineSeedFromUpdate(
  api: WorkerSandkitApi,
  types: TreeTypes,
  args: Record<string, unknown>,
): void {
  const seed = cellFromArgs(args);
  if (!seed) return;
  const wet = preferSupportCell(
    seed,
    cardinalNeighbors(seed.x, seed.y).filter((cell) =>
      api.elements.isTypeAtCell(cell.x, cell.y, types.wetSand),
    ),
  );
  if (!wet) return;
  plantSeedOnWetSand(api, types, seed.x, seed.y, wet.x, wet.y);
}

export function treeFields(api: WorkerSandkitApi, cellX: number, cellY: number) {
  return {
    rootX: api.elements.getDataFieldAtCell(cellX, cellY, FIELD.rootX) ?? cellX,
    rootY: api.elements.getDataFieldAtCell(cellX, cellY, FIELD.rootY) ?? cellY,
    progress: api.elements.getDataFieldAtCell(cellX, cellY, FIELD.trunkHeight) ?? 1,
    phase: api.elements.getDataFieldAtCell(cellX, cellY, FIELD.phase) ?? PHASE.growingTrunk,
  };
}

export function writeTreeFields(
  api: WorkerSandkitApi,
  cellX: number,
  cellY: number,
  fields: { rootX: number; rootY: number; progress: number; phase: number },
): void {
  api.elements.setDataFieldAtCell(cellX, cellY, FIELD.rootX, fields.rootX);
  api.elements.setDataFieldAtCell(cellX, cellY, FIELD.rootY, fields.rootY);
  api.elements.setDataFieldAtCell(cellX, cellY, FIELD.trunkHeight, fields.progress);
  api.elements.setDataFieldAtCell(cellX, cellY, FIELD.phase, fields.phase);
}

export function scheduleShootGrowth(api: WorkerSandkitApi, cellX: number, cellY: number): void {
  api.elements.setDurationAtCell(cellX, cellY, GROW_DURATION_TICKS, { updateMax: true });
  api.grid.reportActivityAtCell(cellX, cellY);
}
