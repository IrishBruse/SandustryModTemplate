import { inGame, isEnabled } from "@modkit/utils";
import { cargoCount } from "./cart/cargo.ts";
import { cargoPileCells } from "./cart/cargoPile.ts";
import { getLoadDrops, loadDropPos, pruneLoadDrops } from "./cart/loadDrops.ts";
import { lerpCell } from "./cart/motion.ts";
import { CART_DRAW_SCALE, MAX_CARGO, MOVE_INTERVAL_MS, TILE_CELLS } from "./constants.ts";
import { getCarts } from "./runtime.ts";

const api = sandkit.api;
let drawStarted = false;

/** Steel running surface in `rail.png` (bottom 4×4 cell of the 16×16 atlas). */
const RAIL_SURFACE_T = 13 / 16;

/** Side-view wagon in logical pixels (matches `cart.png`). */
const CART_PX = [
  "................",
  ".kkkkkkkkkkkkk..",
  "khhhhhhhhhhhhhk.",
  "kCiiiiiiiiiiiCk.",
  "kCiiiiiiiiiiiCk.",
  "kCiiiiiiiiiiiCk.",
  "kCCCCCCCCCCCCCk.",
  ".kDkkkkkkkkDDk..",
  "..kWk......kWk..",
  "..kWk......kWk..",
  "..kkk......kkk..",
] as const;

const CART_LOG = { w: CART_PX[0].length, h: CART_PX.length };

const PALETTE = {
  outline: "#000000",
  frame: "#707478",
  frameHi: "#b0b4bc",
  interior: "#303a42",
  cargo: "#9a5a28",
  cargoHi: "#c07038",
  cargoShadow: "#704018",
  wheel: "#484c50",
  chassis: "#40464a",
} as const;

function cargoTint(count: number): { base: string; hi: string; shadow: string } {
  if (count <= 0) {
    return { base: PALETTE.cargo, hi: PALETTE.cargoHi, shadow: PALETTE.cargoShadow };
  }
  const t = Math.min(1, count / MAX_CARGO);
  const mix = (from: number, to: number) => Math.round(from + (to - from) * t);
  return {
    base: `rgb(${mix(154, 120)}, ${mix(90, 170)}, ${mix(40, 210)})`,
    hi: `rgb(${mix(192, 150)}, ${mix(112, 200)}, ${mix(56, 230)})`,
    shadow: `rgb(${mix(112, 80)}, ${mix(64, 120)}, ${mix(24, 160)})`,
  };
}

function viewZoom(): number {
  const zoom = (sandkit.state as { session?: { view?: { zoom?: number } } }).session?.view?.zoom;
  return typeof zoom === "number" && zoom > 0 ? zoom : 1;
}

function paintPixel(
  ctx: CanvasRenderingContext2D,
  lx: number,
  ly: number,
  px: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(lx * px, ly * px, px, px);
}

function paintCargoPile(
  ctx: CanvasRenderingContext2D,
  px: number,
  originX: number,
  floorY: number,
  interiorW: number,
  interiorH: number,
  cargo: number,
): void {
  const tint = cargoTint(cargo);
  const cells = cargoPileCells(cargo, MAX_CARGO, interiorW, interiorH);
  const filled = new Set(cells.map(([cx, cy]) => `${cx},${cy}`));
  for (const [x, y] of cells) {
    const lx = originX + x;
    const ly = floorY - y;
    const top = !filled.has(`${x},${y + 1}`);
    const left = !filled.has(`${x - 1},${y}`);
    paintPixel(ctx, lx, ly, px, top ? tint.hi : left ? tint.shadow : tint.base);
  }
}

const CART_FILL: Record<string, string> = {
  k: PALETTE.outline,
  h: PALETTE.frameHi,
  C: PALETTE.frame,
  i: PALETTE.interior,
  D: PALETTE.chassis,
  W: PALETTE.wheel,
};

/** Side-view wagon. Interior `i` cells hold the cargo pile. */
function paintCartBody(ctx: CanvasRenderingContext2D, px: number, cargo: number): void {
  for (let y = 0; y < CART_PX.length; y += 1) {
    const row = CART_PX[y];
    for (let x = 0; x < row.length; x += 1) {
      const color = CART_FILL[row[x]];
      if (!color) continue;
      paintPixel(ctx, x, y, px, color);
    }
  }

  paintCargoPile(ctx, px, 2, 5, 12, 3, cargo);
}

function paintCart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  lastDx: number,
  cargo: number,
): void {
  const px = Math.max(1, Math.round(w / CART_LOG.w));
  const cartW = px * CART_LOG.w;
  const cartH = px * CART_LOG.h;
  const railY = Math.round(y + h * RAIL_SURFACE_T);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(Math.round(x + w / 2), railY);
  if (lastDx < 0) ctx.scale(-1, 1);
  ctx.translate(-cartW / 2, -cartH);
  paintCartBody(ctx, px, cargo);
  ctx.restore();
}

function cartCell(
  cart: ReturnType<typeof getCarts>[number],
  now: number,
): { x: number; y: number } {
  const t = cart.movedAtMs > 0 ? (now - cart.movedAtMs) / MOVE_INTERVAL_MS : 1;
  return lerpCell(cart.fromX, cart.fromY, cart.cellX, cart.cellY, t);
}

function screenCellPos(
  pos: { x: number; y: number },
  zoom: number,
  cx: number,
  cy: number,
): { x: number; y: number; cellW: number } | null {
  const floorX = Math.floor(pos.x);
  const floorY = Math.floor(pos.y);
  const origin = api.rendering.getDrawPositionAtCell(floorX, floorY);
  const next = api.rendering.getDrawPositionAtCell(floorX + 1, floorY + 1);
  const cellW = next.x - origin.x;
  const cellH = next.y - origin.y;
  if (cellW <= 0 || cellH <= 0) return null;
  let x = origin.x + (pos.x - floorX) * cellW;
  let y = origin.y + (pos.y - floorY) * cellH;
  if (zoom !== 1) {
    x = cx + (x - cx) * zoom;
    y = cy + (y - cy) * zoom;
  }
  return { x, y, cellW: cellW * zoom };
}

function paintLoadDrops(
  ctx: CanvasRenderingContext2D,
  now: number,
  zoom: number,
  cx: number,
  cy: number,
): void {
  pruneLoadDrops(now);
  for (const drop of getLoadDrops()) {
    const pos = loadDropPos(drop, now);
    const screen = screenCellPos(pos, zoom, cx, cy);
    if (!screen) continue;
    const size = Math.max(1, Math.round(screen.cellW * 0.35));
    ctx.fillStyle = PALETTE.outline;
    ctx.fillRect(screen.x - size / 2 - 1, screen.y - size / 2 - 1, size + 2, size + 2);
    ctx.fillStyle = PALETTE.cargoHi;
    ctx.fillRect(screen.x - size / 2, screen.y - size / 2, size, size);
  }
}

function paint(): void {
  if (!inGame() || !isEnabled(api)) return;

  const now = api.time.getTimeMs();
  const zoom = viewZoom();
  const vp = api.rendering.getOverlayViewportSize();
  const cx = vp.width / 2;
  const cy = vp.height / 2;

  api.rendering.withOverlayContext((ctx) => {
    paintLoadDrops(ctx, now, zoom, cx, cy);
    for (const cart of getCarts()) {
      const pos = cartCell(cart, now);
      const floorX = Math.floor(pos.x);
      const floorY = Math.floor(pos.y);
      const origin = api.rendering.getDrawPositionAtCell(floorX, floorY);
      const next = api.rendering.getDrawPositionAtCell(floorX + 1, floorY + 1);
      const cellW = next.x - origin.x;
      const cellH = next.y - origin.y;
      if (cellW <= 0 || cellH <= 0) continue;
      const tileW = cellW * TILE_CELLS;
      const tileH = cellH * TILE_CELLS;
      let x = origin.x + (pos.x - floorX) * cellW;
      let y = origin.y + (pos.y - floorY) * cellH;
      let w = tileW * CART_DRAW_SCALE;
      let h = tileH * CART_DRAW_SCALE;
      x -= (w - tileW) / 2;
      y -= (h - tileH) * RAIL_SURFACE_T;
      if (zoom !== 1) {
        x = cx + (x - cx) * zoom;
        y = cy + (y - cy) * zoom;
        w *= zoom;
        h *= zoom;
      }
      paintCart(ctx, x, y, w, h, cart.lastDx, cargoCount(cart.cargo));
    }
  });
}

export function startCartDraw(): void {
  if (drawStarted) return;
  drawStarted = true;
  api.events.on("frame:render", paint);
}
