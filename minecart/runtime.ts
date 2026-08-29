import { isEnabled, safe } from "@modkit/utils";
import { addCargo, cargoCount, takeCargo } from "./cart/cargo.ts";
import { resetLoadDrops, spawnLoadDrop } from "./cart/loadDrops.ts";
import { nextStep } from "./cart/path.ts";
import {
  CART_ITEM,
  LOAD_PER_TICK,
  MAX_CARGO,
  MOVE_INTERVAL_MS,
  STRUCTURE,
} from "./ids.ts";
import { modinfo } from "./modinfo.ts";
import { cellKey, linkedCells, snapTile, type TileKind } from "./rail/tiles.ts";
import {
  cartIsAtLoader,
  cartIsAtUnloader,
  pickUnloadCell,
  stationIntakeCells,
} from "./stations/dock.ts";
import { isLoadableMatter } from "./stations/matter.ts";

const api = sandkit.api;
const STORAGE_KEY = "carts";

export type Cart = {
  id: number;
  cellX: number;
  cellY: number;
  fromX: number;
  fromY: number;
  movedAtMs: number;
  lastDx: number;
  lastDy: number;
  cargo: Record<string, number>;
  drone: { x: number; y: number } | null;
};

const carts: Cart[] = [];
let nextCartId = 1;
let lastMoveMs = 0;
let loopGeneration = 0;

export function getCarts(): readonly Cart[] {
  return carts;
}

function persist(): void {
  api.storage.ensure(modinfo.id);
  api.storage.set(
    modinfo.id,
    STORAGE_KEY,
    carts.map((cart) => ({
      cellX: cart.cellX,
      cellY: cart.cellY,
      lastDx: cart.lastDx,
      lastDy: cart.lastDy,
      cargo: cart.cargo,
    })),
  );
}

export function loadCarts(): void {
  carts.length = 0;
  api.storage.ensure(modinfo.id);
  const saved = api.storage.get(modinfo.id, STORAGE_KEY);
  if (!Array.isArray(saved)) return;
  for (const row of saved) {
    if (!row || typeof row !== "object") continue;
    const data = row as Record<string, unknown>;
    if (typeof data.cellX !== "number" || typeof data.cellY !== "number") continue;
    carts.push({
      id: nextCartId,
      cellX: data.cellX,
      cellY: data.cellY,
      fromX: data.cellX,
      fromY: data.cellY,
      movedAtMs: 0,
      lastDx: typeof data.lastDx === "number" ? data.lastDx : 0,
      lastDy: typeof data.lastDy === "number" ? data.lastDy : 0,
      cargo:
        data.cargo && typeof data.cargo === "object"
          ? { ...(data.cargo as Record<string, number>) }
          : {},
      drone: null,
    });
    nextCartId += 1;
  }
  killStrayCartDrones();
  resetLoadDrops();
}

function collectTiles(): Map<string, TileKind> {
  const tiles = new Map<string, TileKind>();
  const add = (id: string, kind: TileKind) => {
    api.structures.forEachOfType(id, (structure) => {
      tiles.set(cellKey(structure.x, structure.y), kind);
    });
  };
  add(STRUCTURE.rail, "rail");
  add(STRUCTURE.rampRiseRight, "rampRiseRight");
  add(STRUCTURE.rampRiseLeft, "rampRiseLeft");
  return tiles;
}

function collectStations(kind: "loader" | "unloader"): { x: number; y: number }[] {
  const id = kind === "loader" ? STRUCTURE.loader : STRUCTURE.unloader;
  const list: { x: number; y: number }[] = [];
  api.structures.forEachOfType(id, (structure) => {
    list.push({ x: structure.x, y: structure.y });
  });
  return list;
}

function railOccupancy(skip?: Cart): Set<string> {
  const occupied = new Set<string>();
  for (const cart of carts) {
    if (cart === skip) continue;
    occupied.add(cellKey(cart.cellX, cart.cellY));
  }
  return occupied;
}

function tryLoad(cart: Cart, structureX: number, structureY: number): boolean {
  if (cargoCount(cart.cargo) >= MAX_CARGO) return false;
  let loaded = 0;
  const now = api.time.getTimeMs();
  for (const cell of stationIntakeCells(structureX, structureY)) {
    if (loaded >= LOAD_PER_TICK) break;
    if (cargoCount(cart.cargo) >= MAX_CARGO) break;
    const matter = api.elements.getMatterTypeAtCell(cell.x, cell.y);
    if (!isLoadableMatter(matter)) continue;
    const elementType = api.elements.getTypeAtCell(cell.x, cell.y);
    if (elementType == null) continue;
    if (!addCargo(cart.cargo, Number(elementType))) break;
    api.elements.removeAtCell(cell.x, cell.y);
    spawnLoadDrop(structureX, structureY, cart.cellX, cart.cellY, now);
    loaded += 1;
  }
  return loaded > 0;
}

function randomFreeOutputCell(
  structureX: number,
  structureY: number,
): { x: number; y: number } | null {
  return pickUnloadCell(structureX, structureY, (x, y) => api.world.isCellEmptyAtCell(x, y));
}

function tryUnload(cart: Cart, structureX: number, structureY: number): boolean {
  const elementType = takeCargo(cart.cargo);
  if (elementType == null) return false;
  const free = randomFreeOutputCell(structureX, structureY);
  if (!free) {
    addCargo(cart.cargo, elementType);
    return false;
  }
  api.elements.createAtCell(free.x, free.y, elementType as never);
  return true;
}

function padHasLoadable(structureX: number, structureY: number): boolean {
  return stationIntakeCells(structureX, structureY).some((cell) =>
    isLoadableMatter(api.elements.getMatterTypeAtCell(cell.x, cell.y)),
  );
}

function stationStay(cart: Cart): boolean {
  for (const loader of collectStations("loader")) {
    if (!cartIsAtLoader(cart.cellX, cart.cellY, loader.x, loader.y)) continue;
    if (tryLoad(cart, loader.x, loader.y)) return true;
    if (cargoCount(cart.cargo) >= MAX_CARGO) return false;
    return padHasLoadable(loader.x, loader.y);
  }
  for (const unloader of collectStations("unloader")) {
    if (!cartIsAtUnloader(cart.cellX, cart.cellY, unloader.x, unloader.y)) continue;
    if (tryUnload(cart, unloader.x, unloader.y)) return cargoCount(cart.cargo) > 0;
    if (cargoCount(cart.cargo) <= 0) return false;
    return randomFreeOutputCell(unloader.x, unloader.y) != null;
  }
  return false;
}

function setCartCell(cart: Cart, x: number, y: number, now: number): void {
  cart.fromX = cart.cellX;
  cart.fromY = cart.cellY;
  cart.movedAtMs = now;
  cart.cellX = x;
  cart.cellY = y;
}

function killStrayCartDrones(): void {
  const drones = (sandkit.state as { store?: { drones?: unknown[] } }).store?.drones;
  if (!Array.isArray(drones)) return;
  for (const drone of drones.slice()) {
    if (!drone || typeof drone !== "object") continue;
    const row = drone as { type?: unknown; data?: { cartId?: unknown } };
    if (row.type !== CART_ITEM && row.data?.cartId == null) continue;
    safe(() => sandkit.engine.api.drones.kill(sandkit.state, drone));
  }
}

function killDrone(cart: Cart): void {
  if (!cart.drone) return;
  safe(() => sandkit.engine.api.drones.kill(sandkit.state, cart.drone));
  cart.drone = null;
}

function removeCart(cart: Cart): void {
  killDrone(cart);
  const index = carts.indexOf(cart);
  if (index >= 0) carts.splice(index, 1);
}

function cartAtTile(cellX: number, cellY: number): Cart | undefined {
  const tile = snapTile(cellX, cellY);
  return carts.find((cart) => cart.cellX === tile.x && cart.cellY === tile.y);
}

export function removeCartAtCell(cellX: number, cellY: number): boolean {
  const cart = cartAtTile(cellX, cellY);
  if (!cart) return false;
  removeCart(cart);
  persist();
  return true;
}

export function spawnCartAtCell(cellX: number, cellY: number): boolean {
  if (!isEnabled(api)) return false;
  const tile = snapTile(cellX, cellY);
  const tiles = collectTiles();
  if (!tiles.has(cellKey(tile.x, tile.y))) {
    api.ui.toast("Place a minecart on rail", {});
    return false;
  }
  if (railOccupancy().has(cellKey(tile.x, tile.y))) {
    api.ui.toast("That rail already has a cart", {});
    return false;
  }
  const cart: Cart = {
    id: nextCartId,
    cellX: tile.x,
    cellY: tile.y,
    fromX: tile.x,
    fromY: tile.y,
    movedAtMs: 0,
    lastDx: 0,
    lastDy: 0,
    cargo: {},
    drone: null,
  };
  nextCartId += 1;
  carts.push(cart);
  persist();
  return true;
}

let demolishWasPressed = false;

function tryDemolishCartUnderMouse(): void {
  const session = (
    sandkit.state as {
      session?: {
        construction?: { demolisherActive?: boolean };
        input?: { mouse?: { pressed?: boolean } };
      };
    }
  ).session;
  const demolish = session?.construction?.demolisherActive === true;
  const pressed = session?.input?.mouse?.pressed === true;
  const edge = demolish && pressed && !demolishWasPressed;
  demolishWasPressed = demolish && pressed;
  if (!edge) return;
  const cell = api.input.getMouseCellPosition();
  if (!removeCartAtCell(cell.x, cell.y)) return;
  api.ui.toast("Removed minecart", {});
}

function dropOrphanCarts(tiles: Map<string, TileKind>): boolean {
  let removed = false;
  for (let i = carts.length - 1; i >= 0; i -= 1) {
    const cart = carts[i];
    if (tiles.has(cellKey(cart.cellX, cart.cellY))) continue;
    removeCart(cart);
    removed = true;
  }
  return removed;
}

export function tickCarts(): void {
  if (!isEnabled(api)) return;
  tryDemolishCartUnderMouse();

  const now = api.time.getTimeMs();
  if (now - lastMoveMs < MOVE_INTERVAL_MS) return;
  lastMoveMs = now;

  const tiles = collectTiles();
  const dropped = dropOrphanCarts(tiles);

  for (const cart of carts) {
    if (stationStay(cart)) continue;

    const linked = linkedCells(cart.cellX, cart.cellY, tiles);
    const occupied = railOccupancy(cart);
    const step = nextStep(
      { x: cart.cellX, y: cart.cellY },
      cart.lastDx,
      cart.lastDy,
      linked,
      occupied,
    );
    if (step.wait) continue;

    cart.lastDx = step.lastDx;
    cart.lastDy = step.lastDy;
    setCartCell(cart, step.cell.x, step.cell.y, now);
  }

  if (carts.length > 0 || dropped) persist();
}

export function startCartLoop(): void {
  loopGeneration += 1;
  const generation = loopGeneration;
  const step = () => {
    if (generation !== loopGeneration) return;
    tickCarts();
    api.schedule.nextTick(step);
  };
  step();
}
