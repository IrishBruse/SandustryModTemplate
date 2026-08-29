import { FIELD } from "./constants.ts";
import { treeFields } from "./planting.ts";
import { collapseTrunkAround } from "./trunk.ts";
import type { TreeTypes } from "./types.ts";

function convertFalling(
  api: WorkerSandkitApi,
  cellX: number,
  cellY: number,
  elementType: number,
): void {
  api.elements.replaceAtCell(cellX, cellY, elementType, { isFreeFalling: true });
  api.grid.reportActivityAtCell(cellX, cellY);
}

export function collapseIfUnsupported(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
  selfType: number,
): void {
  const { rootX, rootY } = treeFields(api, cellX, cellY);
  if (api.terrains.getTypeAtCell(rootX, rootY) === types.pineWood) return;
  if (selfType === types.pineNeedle) {
    convertFalling(api, cellX, cellY, types.leafDust);
    return;
  }
  convertFalling(api, cellX, cellY, types.rawWood);
}

export function collapseTrunkFromDestroyed(
  api: WorkerSandkitApi,
  types: TreeTypes,
  cellX: number,
  cellY: number,
): void {
  collapseTrunkAround(cellX, cellY, {
    isPineWood: (x, y) => api.terrains.getTypeAtCell(x, y) === types.pineWood,
    isNeedle: (x, y) => api.elements.isTypeAtCell(x, y, types.pineNeedle),
    isShoot: (x, y) => api.elements.isTypeAtCell(x, y, types.pineShoot),
    needleRootX: (x, y) => api.elements.getDataFieldAtCell(x, y, FIELD.rootX) ?? x,
    removeWood: (x, y) => {
      api.terrains.removeAtCell(x, y);
    },
    dropRawWood: (x, y) => {
      if (api.elements.getTypeAtCell(x, y) !== null) {
        api.elements.replaceAtCell(x, y, types.rawWood, { isFreeFalling: true });
      } else {
        api.elements.createAtCell(x, y, types.rawWood, { isFreeFalling: true });
      }
      api.grid.reportActivityAtCell(x, y);
    },
    dropLeafDust: (x, y) => {
      convertFalling(api, x, y, types.leafDust);
    },
  });
}
