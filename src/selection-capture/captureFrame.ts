import type { CellBounds } from "./selectionBounds";
import { MOD_ID } from "./globals";

const LOG = `[${MOD_ID}]`;

/** Sky fill when the WebGL backdrop cannot be sampled. */
const FALLBACK_SKY = "#3d6b78";

/** Extra screen pixels on each edge so structure outlines are not clipped. */
const BORDER_PX = 1;

type SessionRendering = {
  canvas?: HTMLCanvasElement;
  pixi?: {
    app?: {
      canvas?: HTMLCanvasElement;
      view?: HTMLCanvasElement;
    };
    dynamic2D?: {
      context?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    };
  };
};

type SessionShape = {
  paused?: boolean;
  rendering?: SessionRendering;
};

export function getSession(): SessionShape | null {
  const session = sandkit.state.session as SessionShape | null | undefined;
  return session ?? null;
}

function getGameCanvas(): HTMLCanvasElement | null {
  const rendering = getSession()?.rendering;
  return rendering?.canvas ?? rendering?.pixi?.app?.canvas ?? rendering?.pixi?.app?.view ?? null;
}

function getDynamic2DCanvas(): HTMLCanvasElement | OffscreenCanvas | null {
  const context = getSession()?.rendering?.pixi?.dynamic2D?.context;
  const canvas = context?.canvas;
  return canvas ?? null;
}

type ScreenRect = { x: number; y: number; width: number; height: number };

function getSelectionScreenRect(api: SandkitApi, bounds: CellBounds): ScreenRect | null {
  const topLeft = api.rendering.getDrawPositionAtCell(bounds.minX, bounds.minY);
  const bottomRight = api.rendering.getDrawPositionAtCell(bounds.maxX + 1, bounds.maxY + 1);
  if (
    !Number.isFinite(topLeft.x) ||
    !Number.isFinite(topLeft.y) ||
    !Number.isFinite(bottomRight.x) ||
    !Number.isFinite(bottomRight.y)
  ) {
    return null;
  }
  const x = Math.round(topLeft.x);
  const y = Math.round(topLeft.y);
  const width = Math.round(bottomRight.x - topLeft.x);
  const height = Math.round(bottomRight.y - topLeft.y);
  if (width <= 0 || height <= 0) return null;
  return {
    x: x - BORDER_PX,
    y: y - BORDER_PX,
    width: width + BORDER_PX * 2,
    height: height + BORDER_PX * 2,
  };
}

function clipRectToCanvas(rect: ScreenRect, canvasW: number, canvasH: number): ScreenRect | null {
  const x0 = Math.max(0, rect.x);
  const y0 = Math.max(0, rect.y);
  const x1 = Math.min(canvasW, rect.x + rect.width);
  const y1 = Math.min(canvasH, rect.y + rect.height);
  const width = x1 - x0;
  const height = y1 - y0;
  if (width <= 0 || height <= 0) return null;
  return { x: x0, y: y0, width, height };
}

/**
 * Copy pixels on the first microtask after `frame:render`.
 * That event fires just before `texture.update` + Pixi render — a sync read is
 * still the sky clear. Waiting an extra `await` hop is too late (WebGL buffer gone).
 */
export function rasterizeOnPaint(
  api: SandkitApi,
  bounds: CellBounds,
  scale: number,
): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timeoutId = 0;
    const unsubscribe = api.events.on("frame:render", () => {
      unsubscribe();
      queueMicrotask(() => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        try {
          resolve(rasterizeSelection(api, bounds, scale));
        } catch (error) {
          reject(error);
        }
      });
    });
    timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      unsubscribe();
      reject(new Error("paint wait timed out"));
    }, 2000);
  });
}

/**
 * Crop the selection from the live game canvases, then nearest-neighbor upscale.
 */
export function rasterizeSelection(
  api: SandkitApi,
  bounds: CellBounds,
  scale: number,
): HTMLCanvasElement | null {
  const screenRect = getSelectionScreenRect(api, bounds);
  if (!screenRect) {
    console.warn(`${LOG} could not map cell bounds to screen`);
    return null;
  }

  const dynamicCanvas = getDynamic2DCanvas();
  if (!dynamicCanvas) {
    console.warn(`${LOG} dynamic2D canvas missing`);
    return null;
  }

  const clip = clipRectToCanvas(screenRect, dynamicCanvas.width, dynamicCanvas.height);
  if (!clip) {
    console.warn(`${LOG} selection off-screen`, { screenRect });
    return null;
  }

  const out = document.createElement("canvas");
  out.width = clip.width;
  out.height = clip.height;
  const ctx = out.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = FALLBACK_SKY;
  ctx.fillRect(0, 0, out.width, out.height);
  const gameCanvas = getGameCanvas();
  if (gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) {
    try {
      ctx.drawImage(
        gameCanvas,
        clip.x,
        clip.y,
        clip.width,
        clip.height,
        0,
        0,
        clip.width,
        clip.height,
      );
    } catch (error) {
      console.warn(`${LOG} WebGL backdrop draw failed:`, error);
    }
  }

  try {
    ctx.drawImage(
      dynamicCanvas,
      clip.x,
      clip.y,
      clip.width,
      clip.height,
      0,
      0,
      clip.width,
      clip.height,
    );
  } catch (error) {
    console.error(`${LOG} dynamic2D draw failed:`, error);
    return null;
  }

  const pixelScale = Math.max(1, Math.round(scale));
  if (pixelScale === 1) return out;

  const scaled = document.createElement("canvas");
  scaled.width = out.width * pixelScale;
  scaled.height = out.height * pixelScale;
  const scaledCtx = scaled.getContext("2d");
  if (!scaledCtx) return out;
  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(out, 0, 0, scaled.width, scaled.height);
  return scaled;
}
