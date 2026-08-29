import { modinfo } from "../modinfo.ts";

const root = modinfo.id;

export const ELEMENT = {
  pineSeed: `${root}:pineSeed`,
  pineShoot: `${root}:pineShoot`,
  pineNeedle: `${root}:pineNeedle`,
  rawWood: `${root}:rawWood`,
  charcoal: `${root}:charcoal`,
  leafDust: `${root}:leafDust`,
} as const;

export const TERRAIN = {
  pineWood: `${root}:pineWood`,
} as const;

export const NAME_KEY = {
  pineSeed: `${root}.pineSeed.name`,
  pineShoot: `${root}.pineShoot.name`,
  pineWood: `${root}.pineWood.name`,
  pineNeedle: `${root}.pineNeedle.name`,
  rawWood: `${root}.rawWood.name`,
  charcoal: `${root}.charcoal.name`,
  leafDust: `${root}.leafDust.name`,
} as const;

export const VANILLA_ELEMENT = {
  wetSand: "wetSand",
  sand: "sand",
  burntResidue: "burntResidue",
} as const;
