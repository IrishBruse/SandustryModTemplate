/** Mature pine trunk height in cells, including the root. */
export const TRUNK_HEIGHT = 48;

/** Extra columns on each side of the center. Total width is `2 * half + 1`. */
export const TRUNK_HALF_WIDTH = 1;

/** PineNeedle rows on the upper trunk (upper ~60%). */
export const CANOPY_ROWS = 28;

/** Needles on each side of the trunk at the bottom of the canopy. */
export const CANOPY_MAX_HALF_WIDTH = 12;

/** Cells above the top trunk row where the needle tip sits. One cell is 4 pixels. */
export const CANOPY_TIP_OFFSET_CELLS = 3;

/** Ticks between growth steps. Duration keeps the Static shoot in the sim after the chunk idles. */
export const GROW_DURATION_TICKS = 1;

/** Trunk rows placed in one duration tick. */
export const TRUNK_GROW_ROWS_PER_TICK = 1;

/** Canopy needle rows placed in one duration tick. */
export const CANOPY_GROW_ROWS_PER_TICK = 1;

/** Resting LeafDust ticks before the cell becomes Dirt terrain. */
export const COMPOST_REST_TICKS = 180;

/** Neighbor speed that counts as mechanical force on needles. */
export const MECHANICAL_SPEED = 40;

export const FIELD = {
  rootX: 1,
  rootY: 2,
  trunkHeight: 3,
  phase: 4,
} as const;

export const PHASE = {
  growingTrunk: 0,
  growingCanopy: 1,
  mature: 2,
} as const;

export const ORTHO8_DIRS: readonly [number, number][] = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

export const CARDINAL_DIRS: readonly [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
