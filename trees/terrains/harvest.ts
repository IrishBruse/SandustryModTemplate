import { ELEMENT } from "../elements/ids.ts";
import { FIELD } from "../sim/constants.ts";
import { collapseTrunkAround } from "../sim/trunk.ts";

const api = sandkit.api;

export function registerHarvest(pineWoodType: number): void {
  const rawWood = api.elements.getTypeById(ELEMENT.rawWood);
  const pineNeedle = api.elements.getTypeById(ELEMENT.pineNeedle);
  const pineShoot = api.elements.getTypeById(ELEMENT.pineShoot);
  const leafDust = api.elements.getTypeById(ELEMENT.leafDust);

  api.events.on("terrain:destroyed", (payload) => {
    if (payload.cellType !== pineWoodType) return;
    const cellX = payload.cellX ?? payload.x;
    const cellY = payload.cellY ?? payload.y;
    if (typeof cellX !== "number" || typeof cellY !== "number") return;

    api.grid.mutate((writer) => {
      collapseTrunkAround(cellX, cellY, {
        isPineWood: (x, y) => api.terrains.getTypeAtCell(x, y) === pineWoodType,
        isNeedle: (x, y) => api.elements.isTypeAtCell(x, y, pineNeedle),
        isShoot: (x, y) => api.elements.isTypeAtCell(x, y, pineShoot),
        needleRootX: (x, y) => api.elements.getDataFieldAtCell(x, y, FIELD.rootX) ?? x,
        removeWood: (x, y) => {
          writer.terrains.removeAtCell(x, y);
        },
        dropRawWood: (x, y) => {
          if (api.elements.getTypeAtCell(x, y) !== null) {
            writer.elements.replaceAtCell(x, y, rawWood, { isFreeFalling: true });
            return;
          }
          writer.elements.createAtCell(x, y, rawWood, { isFreeFalling: true });
        },
        dropLeafDust: (x, y) => {
          writer.elements.replaceAtCell(x, y, leafDust, { isFreeFalling: true });
        },
      });
    });
  });
}
