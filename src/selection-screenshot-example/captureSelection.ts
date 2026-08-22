import type { CellBounds } from "./selectionBounds";
import { MOD_ID } from "./globals";

const LOG = `[${MOD_ID}]`;

type PixelRect = { x: number; y: number; width: number; height: number };

type MapData = {
  data: Uint8Array | Uint8ClampedArray | number[];
  width: number;
  height?: number;
};

type SessionRendering = {
  overlayCanvas?: HTMLCanvasElement;
  pixi?: {
    colorBuffer?: Uint8Array | Uint8ClampedArray | number[];
    tilemapSize?: { width: number; height: number };
  };
};

type SessionShape = {
  rendering?: SessionRendering;
  view?: { zoom?: number };
  camera?: { x?: number; y?: number };
};

type SelectedStructure = {
  x: number;
  y: number;
  type?: string | number;
  originalPos?: { x: number; y: number };
};

function getSession(): SessionShape | null {
  const session = sandkit.state.session as SessionShape | null | undefined;
  return session ?? null;
}

function getMapData(): MapData | null {
  const shared = sandkit.state.shared as { mapData?: MapData } | null | undefined;
  const mapData = shared?.mapData;
  if (!mapData?.data || !mapData.width) {
    console.warn(`${LOG} shared.mapData missing`, {
      hasShared: shared != null,
      keys: shared ? Object.keys(shared).slice(0, 20) : [],
      mapData,
    });
    return null;
  }
  const height =
    mapData.height ??
    Math.floor(mapData.data.length / (4 * mapData.width));
  return { data: mapData.data, width: mapData.width, height };
}

function getViewZoom(): number {
  const zoom = getSession()?.view?.zoom;
  return typeof zoom === "number" && zoom > 0 ? zoom : 1;
}

function getSelectedStructures(): SelectedStructure[] {
  const session = sandkit.state.session as
    | { action?: { customData?: { selectedStructures?: SelectedStructure[] } } }
    | null
    | undefined;
  const list = session?.action?.customData?.selectedStructures;
  return Array.isArray(list) ? list : [];
}

/** Viewport rect (for overlay composite). */
export function cellBoundsToPixelRect(
  api: SandkitApi,
  bounds: CellBounds,
): PixelRect | null {
  const topLeft = api.rendering.getDrawPositionAtCell(bounds.minX, bounds.minY);
  const bottomRight = api.rendering.getDrawPositionAtCell(
    bounds.maxX + 1,
    bounds.maxY + 1,
  );
  const zoom = getViewZoom();
  if (!topLeft || !bottomRight) return null;
  const x = Math.round(Math.min(topLeft.x, bottomRight.x) * zoom);
  const y = Math.round(Math.min(topLeft.y, bottomRight.y) * zoom);
  const width = Math.round(Math.abs(bottomRight.x - topLeft.x) * zoom);
  const height = Math.round(Math.abs(bottomRight.y - topLeft.y) * zoom);
  if (width <= 0 || height <= 0) return null;
  return { x, y, width, height };
}

function clampRect(rect: PixelRect, canvas: HTMLCanvasElement): PixelRect | null {
  const x0 = Math.max(0, Math.min(canvas.width, rect.x));
  const y0 = Math.max(0, Math.min(canvas.height, rect.y));
  const x1 = Math.max(0, Math.min(canvas.width, rect.x + rect.width));
  const y1 = Math.max(0, Math.min(canvas.height, rect.y + rect.height));
  const width = x1 - x0;
  const height = y1 - y0;
  if (width <= 0 || height <= 0) return null;
  return { x: x0, y: y0, width, height };
}

function cellIsVisible(r: number, g: number, b: number, a: number): boolean {
  // Some cells store colour with a===0; treat any strong RGB as solid.
  if (a >= 8) return true;
  return r > 8 || g > 8 || b > 8;
}

function paintCell(
  ctx: CanvasRenderingContext2D,
  localX: number,
  localY: number,
  cellSize: number,
  r: number,
  g: number,
  b: number,
  a: number,
): void {
  const alpha = a >= 8 ? a / 255 : 1;
  ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
  ctx.fillRect(localX * cellSize, localY * cellSize, cellSize, cellSize);
}

/**
 * Primary: `shared.mapData` (per-cell RGBA the tilemap uploads).
 * Fallback: viewport `pixi.colorBuffer`, then yellow structure footprints.
 */
function rasterizeSelection(
  api: SandkitApi,
  bounds: CellBounds,
): HTMLCanvasElement | null {
  const { cellSize } = api.rendering.getGridMetrics();
  const cellsW = bounds.maxX - bounds.minX + 1;
  const cellsH = bounds.maxY - bounds.minY + 1;
  const width = cellsW * cellSize;
  const height = cellsH * cellSize;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#6eb6d4";
  ctx.fillRect(0, 0, width, height);

  let painted = 0;

  const mapData = getMapData();
  if (mapData) {
    const mapH = mapData.height ?? 0;
    console.log(`${LOG} mapData`, {
      width: mapData.width,
      height: mapH,
      dataLength: mapData.data.length,
      cellSize,
      bounds,
    });

    // Probe centre cell raw bytes for debugging.
    const midX = Math.floor((bounds.minX + bounds.maxX) / 2);
    const midY = Math.floor((bounds.minY + bounds.maxY) / 2);
    if (midX >= 0 && midY >= 0 && midX < mapData.width && midY < mapH) {
      const pi = 4 * (midX + midY * mapData.width);
      console.log(`${LOG} centre cell raw`, {
        midX,
        midY,
        rgba: [
          mapData.data[pi],
          mapData.data[pi + 1],
          mapData.data[pi + 2],
          mapData.data[pi + 3],
        ],
      });
    }

    for (let cy = bounds.minY; cy <= bounds.maxY; cy++) {
      for (let cx = bounds.minX; cx <= bounds.maxX; cx++) {
        if (cx < 0 || cy < 0 || cx >= mapData.width || cy >= mapH) continue;
        const i = 4 * (cx + cy * mapData.width);
        const r = Number(mapData.data[i] ?? 0);
        const g = Number(mapData.data[i + 1] ?? 0);
        const b = Number(mapData.data[i + 2] ?? 0);
        const a = Number(mapData.data[i + 3] ?? 0);
        if (!cellIsVisible(r, g, b, a)) continue;
        paintCell(ctx, cx - bounds.minX, cy - bounds.minY, cellSize, r, g, b, a);
        painted++;
      }
    }
    console.log(`${LOG} mapData painted cells:`, painted);
  }

  // Viewport colour buffer (same RGBA tilemap, camera-relative).
  if (painted === 0) {
    const session = getSession();
    const buf = session?.rendering?.pixi?.colorBuffer;
    const tile = session?.rendering?.pixi?.tilemapSize;
    const camera = session?.camera;
    if (buf && tile && camera && cellSize > 0) {
      const camX = camera.x ?? 0;
      const camY = camera.y ?? 0;
      const camCellX = Math.floor(camX / cellSize);
      const camCellY = Math.floor(camY / cellSize);
      console.log(`${LOG} trying colorBuffer`, {
        tile,
        camCellX,
        camCellY,
        bufLen: buf.length,
      });
      for (let cy = bounds.minY; cy <= bounds.maxY; cy++) {
        for (let cx = bounds.minX; cx <= bounds.maxX; cx++) {
          const lx = cx - camCellX;
          const ly = cy - camCellY;
          if (lx < 0 || ly < 0 || lx >= tile.width || ly >= tile.height) continue;
          const i = 4 * (lx + ly * tile.width);
          const r = Number(buf[i] ?? 0);
          const g = Number(buf[i + 1] ?? 0);
          const b = Number(buf[i + 2] ?? 0);
          const a = Number(buf[i + 3] ?? 0);
          if (!cellIsVisible(r, g, b, a)) continue;
          paintCell(ctx, cx - bounds.minX, cy - bounds.minY, cellSize, r, g, b, a);
          painted++;
        }
      }
      console.log(`${LOG} colorBuffer painted cells:`, painted);
    }
  }

  // Last resort: paint selected structure footprints (foundation yellow).
  if (painted === 0) {
    const structures = getSelectedStructures();
    const snap =
      api.rendering.getGridMetrics().snapGridCellSize || 4;
    console.log(`${LOG} painting structure footprints`, {
      count: structures.length,
      snap,
    });
    // Typical foundation / block yellow in-game.
    const fr = 232;
    const fg = 196;
    const fb = 64;
    for (const structure of structures) {
      const origin = structure.originalPos ?? {
        x: structure.x + bounds.minX,
        y: structure.y + bounds.minY,
      };
      for (let dy = 0; dy < snap; dy++) {
        for (let dx = 0; dx < snap; dx++) {
          const cx = origin.x + dx;
          const cy = origin.y + dy;
          if (cx < bounds.minX || cy < bounds.minY || cx > bounds.maxX || cy > bounds.maxY) {
            continue;
          }
          paintCell(
            ctx,
            cx - bounds.minX,
            cy - bounds.minY,
            cellSize,
            fr,
            fg,
            fb,
            255,
          );
          painted++;
        }
      }
    }
    console.log(`${LOG} structure footprint cells:`, painted);
  }

  if (painted === 0) {
    console.warn(`${LOG} nothing painted for selection`);
    return null;
  }
  return canvas;
}

function compositeOverlay(
  base: HTMLCanvasElement,
  viewportRect: PixelRect | null,
): HTMLCanvasElement {
  if (!viewportRect) return base;
  const overlay = getSession()?.rendering?.overlayCanvas;
  if (!(overlay instanceof HTMLCanvasElement)) return base;
  const clamped = clampRect(viewportRect, overlay);
  if (!clamped) return base;
  const ctx = base.getContext("2d");
  if (!ctx) return base;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    overlay,
    clamped.x,
    clamped.y,
    clamped.width,
    clamped.height,
    0,
    0,
    base.width,
    base.height,
  );
  console.log(`${LOG} composited overlay`);
  return base;
}

function downloadPng(canvas: HTMLCanvasElement, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error(`${LOG} toBlob returned null`);
        resolve(false);
        return;
      }
      console.log(`${LOG} downloading`, { filename, bytes: blob.size });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      resolve(true);
    }, "image/png");
  });
}

export function captureSelectionPng(
  api: SandkitApi,
  bounds: CellBounds,
): Promise<"ok" | "no-canvas" | "out-of-view" | "blank" | "failed"> {
  const viewportRect = cellBoundsToPixelRect(api, bounds);
  console.log(`${LOG} capture start (mapData raster)`, { bounds, viewportRect });

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: "ok" | "no-canvas" | "out-of-view" | "blank" | "failed") => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      unsubscribe();
      console.log(`${LOG} capture finished:`, result);
      resolve(result);
    };

    const timeoutId = setTimeout(() => {
      console.warn(`${LOG} timed out`);
      finish("failed");
    }, 2000);

    const unsubscribe = api.events.on("frame:render", () => {
      if (settled) return;
      unsubscribe();
      void (async () => {
        const raster = rasterizeSelection(api, bounds);
        if (!raster) {
          finish(getMapData() ? "blank" : "no-canvas");
          return;
        }
        const finalCrop = compositeOverlay(raster, viewportRect);
        const ok = await downloadPng(
          finalCrop,
          `sandustry-selection-${Date.now()}.png`,
        );
        finish(ok ? "ok" : "failed");
      })();
    });
  });
}
