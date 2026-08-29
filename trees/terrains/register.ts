import { ELEMENT, NAME_KEY, TERRAIN } from "../elements/ids.ts";

const api = sandkit.api;

/** Repeating 4×4 HSL grain. Live soil renderer reads `colorPattern.colorsHSL`. */
const PINE_WOOD_GRAIN: readonly (readonly [number, number, number])[][] = [
  [
    [22, 48, 24],
    [28, 52, 38],
    [20, 45, 22],
    [30, 40, 34],
  ],
  [
    [18, 50, 20],
    [26, 48, 32],
    [22, 42, 26],
    [28, 38, 30],
  ],
  [
    [24, 46, 28],
    [32, 50, 40],
    [20, 48, 22],
    [26, 44, 36],
  ],
  [
    [20, 52, 22],
    [28, 46, 34],
    [18, 44, 20],
    [30, 42, 32],
  ],
];

export function registerTerrains(): number {
  const rawWoodType = api.elements.getTypeById(ELEMENT.rawWood);
  const { cellType } = api.terrains.register({
    id: TERRAIN.pineWood,
    nameKey: NAME_KEY.pineWood,
    hp: 5,
    colorHSL: [25, 50, 32],
    metaColor: 0x5c3a21,
    colorPattern: {
      size: [4, 4],
      colorsHSL: PINE_WOOD_GRAIN,
    },
    output: { elementType: rawWoodType, chance: 1 },
  });
  api.discoveries.addTerrainByType(cellType);
  return cellType;
}
