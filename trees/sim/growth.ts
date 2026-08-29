import { canopyRowCells, canopyTipY, canopyTreeTopY } from "./canopy.ts";
import {
  CANOPY_GROW_ROWS_PER_TICK,
  CANOPY_ROWS,
  GROW_DURATION_TICKS,
  PHASE,
  TRUNK_GROW_ROWS_PER_TICK,
  TRUNK_HEIGHT,
} from "./constants.ts";
import { placeTrunkRow, scheduleShootGrowth, treeFields, writeTreeFields } from "./planting.ts";
import type { TreeTypes } from "./types.ts";

function createShoot(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
  rootX: number,
  rootY: number,
  progress: number,
  phase: number,
): void {
  api.elements.createAtCell(cellX, cellY, types.pineShoot, {
    durationTicks: GROW_DURATION_TICKS,
    dataFields: {
      field1: rootX,
      field2: rootY,
      field3: progress,
      field4: phase,
    },
  });
  scheduleShootGrowth(api, cellX, cellY);
  api.grid.reportActivityAtCell(cellX, cellY);
}

function placeNeedle(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
  rootX: number,
  rootY: number,
): void {
  if (api.terrains.getTypeAtCell(cellX, cellY) === types.pineWood) return;
  if (!api.grid.isCellEmptyAtCell(cellX, cellY)) return;
  api.elements.createAtCell(cellX, cellY, types.pineNeedle, {
    dataFields: { field1: rootX, field2: rootY },
  });
  api.grid.reportActivityAtCell(cellX, cellY);
}

function finishCanopy(
  api: WorkerSandkitApi,
  types: TreeTypes,
  shootX: number,
  shootY: number,
  fields: { rootX: number; rootY: number },
): void {
  placeNeedle(api, types, fields.rootX, canopyTipY(fields.rootY), fields.rootX, fields.rootY);
  if (!api.elements.isTypeAtCell(shootX, shootY, types.pineShoot)) return;
  if (api.terrains.getTypeAtCell(shootX, shootY) === types.pineWood) {
    api.elements.removeAtCell(shootX, shootY);
    return;
  }
  if (shootY >= canopyTreeTopY(fields.rootY)) {
    api.elements.removeAtCell(shootX, shootY);
    return;
  }
  api.elements.replaceAtCell(shootX, shootY, types.pineNeedle, {
    dataFields: { field1: fields.rootX, field2: fields.rootY },
  });
  api.grid.reportActivityAtCell(shootX, shootY);
}

function growCanopy(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
  fields: { rootX: number; rootY: number; progress: number; phase: number },
): void {
  let rowsDone = fields.progress;
  const rowLimit = Math.min(rowsDone + CANOPY_GROW_ROWS_PER_TICK, CANOPY_ROWS);
  while (rowsDone < rowLimit) {
    for (const cell of canopyRowCells(fields.rootX, fields.rootY, rowsDone)) {
      placeNeedle(api, types, cell.x, cell.y, fields.rootX, fields.rootY);
    }
    rowsDone += 1;
  }

  if (rowsDone >= CANOPY_ROWS) {
    finishCanopy(api, types, cellX, cellY, fields);
    return;
  }

  writeTreeFields(api, cellX, cellY, {
    rootX: fields.rootX,
    rootY: fields.rootY,
    progress: rowsDone,
    phase: PHASE.growingCanopy,
  });
  scheduleShootGrowth(api, cellX, cellY);
}

function growTrunk(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
  fields: { rootX: number; rootY: number; progress: number; phase: number },
): void {
  let height = fields.progress;
  let shootY = cellY;
  api.elements.removeAtCell(cellX, cellY);

  for (let step = 0; step < TRUNK_GROW_ROWS_PER_TICK; step += 1) {
    if (height >= TRUNK_HEIGHT) break;
    const nextY = shootY - 1;
    if (!api.grid.isCellEmptyAtCell(cellX, nextY)) {
      createShoot(
        api,
        types,
        cellX,
        shootY,
        fields.rootX,
        fields.rootY,
        height,
        PHASE.growingTrunk,
      );
      return;
    }
    placeTrunkRow(api, types, fields.rootX, shootY);
    height += 1;
    shootY = nextY;
  }

  const canopyReady = height >= TRUNK_HEIGHT;
  createShoot(
    api,
    types,
    cellX,
    shootY,
    fields.rootX,
    fields.rootY,
    canopyReady ? 0 : height,
    canopyReady ? PHASE.growingCanopy : PHASE.growingTrunk,
  );
}

export function growPineShoot(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
): void {
  if (!api.elements.isTypeAtCell(cellX, cellY, types.pineShoot)) return;
  const fields = treeFields(api, cellX, cellY);
  if (fields.phase === PHASE.mature) {
    api.elements.removeAtCell(cellX, cellY);
    return;
  }
  if (fields.phase === PHASE.growingCanopy) {
    growCanopy(api, types, cellX, cellY, fields);
    return;
  }
  growTrunk(api, types, cellX, cellY, fields);
}
