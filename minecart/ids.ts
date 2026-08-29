import { modinfo } from "./modinfo.ts";

export {
  CELL_PX,
  LOAD_PER_TICK,
  MAX_CARGO,
  MOVE_INTERVAL_MS,
  STATION_SIZE,
  TILE_CELLS,
} from "./constants.ts";

const root = modinfo.id;

export const STRUCTURE = {
  rail: `${root}:rail`,
  rampRiseRight: `${root}:ramp-rise-right`,
  rampRiseLeft: `${root}:ramp-rise-left`,
  loader: `${root}:loader`,
  unloader: `${root}:unloader`,
} as const;

export const SPRITE = {
  rail: `${root}:rail-sprite`,
  rampRiseRight: `${root}:ramp-rise-right-sprite`,
  rampRiseLeft: `${root}:ramp-rise-left-sprite`,
  loader: `${root}:loader-sprite`,
  unloader: `${root}:unloader-sprite`,
  cart: `${root}:cart-sprite`,
  cartIcon: `${root}:cart-icon`,
} as const;

export const CART_ITEM = `${root}:cart`;
