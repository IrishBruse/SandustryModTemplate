import type { CellBounds } from "./selectionBounds";
import { MOD_ID } from "./globals";

const LOG = `[${MOD_ID}]`;

/** Sky fill when the WebGL backdrop cannot be sampled. */
const FALLBACK_SKY = "#3d6b78";

/** Clipboard PNG vs captured screen pixels. Nearest-neighbor — no blur. */
const UPSCALE = 2;

/** Extra screen pixels on each edge so structure outlines are not clipped. */
const BORDER_PX = 1;

type SessionRendering = {
  canvas?: HTMLCanvasElement;
  overlayCanvas?: HTMLCanvasElement;
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
  rendering?: SessionRendering;
  camera?: { x?: number; y?: number };
  view?: { zoom?: number };
};

function getSession(): SessionShape | null {
  const session = sandkit.state.session as SessionShape | null | undefined;
  return session ?? null;
}

function getGameCanvas(): HTMLCanvasElement | null {
  const session = getSession();
  const rendering = session?.rendering;
  return (
    rendering?.canvas ??
    rendering?.pixi?.app?.canvas ??
    rendering?.pixi?.app?.view ??
    null
  );
}

/**
 * Foundations (and other buildings) are drawn into this 2D canvas each frame,
 * then uploaded as a Pixi texture. `mapData` RGB is not the on-screen colour
 * (Block cells often store the red missing-soil fallback).
 */
function getDynamic2DCanvas(): HTMLCanvasElement | OffscreenCanvas | null {
  const context = getSession()?.rendering?.pixi?.dynamic2D?.context;
  const canvas = context?.canvas;
  return canvas ?? null;
}

type ScreenRect = { x: number; y: number; width: number; height: number };

function getSelectionScreenRect(
  api: SandkitApi,
  bounds: CellBounds,
): ScreenRect | null {
  const topLeft = api.rendering.getDrawPositionAtCell(bounds.minX, bounds.minY);
  const bottomRight = api.rendering.getDrawPositionAtCell(
    bounds.maxX + 1,
    bounds.maxY + 1,
  );
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

function clipRectToCanvas(
  rect: ScreenRect,
  canvasW: number,
  canvasH: number,
): ScreenRect | null {
  const x0 = Math.max(0, rect.x);
  const y0 = Math.max(0, rect.y);
  const x1 = Math.min(canvasW, rect.x + rect.width);
  const y1 = Math.min(canvasH, rect.y + rect.height);
  const width = x1 - x0;
  const height = y1 - y0;
  if (width <= 0 || height <= 0) return null;
  return { x: x0, y: y0, width, height };
}

function rasterizeSelection(
  api: SandkitApi,
  bounds: CellBounds,
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

  const clip = clipRectToCanvas(
    screenRect,
    dynamicCanvas.width,
    dynamicCanvas.height,
  );
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

  // Backdrop: real WebGL frame (sky / terrain). Structures sit on dynamic2D above it.
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

  // Structure sprites (gold foundations, etc.) — no cyan selection chrome (that is overlay-only).
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

  const scaled = document.createElement("canvas");
  scaled.width = out.width * UPSCALE;
  scaled.height = out.height * UPSCALE;
  const scaledCtx = scaled.getContext("2d");
  if (!scaledCtx) return out;
  // Duplicate each pixel into a UPSCALE×UPSCALE block (bilinear would blur).
  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(out, 0, 0, scaled.width, scaled.height);

  console.log(`${LOG} rasterized dynamic2D crop`, {
    bounds,
    screenRect,
    clip,
    size: { width: scaled.width, height: scaled.height },
    upscale: UPSCALE,
  });
  return scaled;
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

/** Write the PNG to the system clipboard (no file download). */
async function copyPngToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  const blob = await canvasToPngBlob(canvas);
  if (!blob) {
    console.error(`${LOG} toBlob returned null`);
    return false;
  }
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    console.error(`${LOG} clipboard image write unavailable`);
    return false;
  }
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": Promise.resolve(blob) }),
    ]);
    console.log(`${LOG} copied PNG to clipboard`, { bytes: blob.size });
    return true;
  } catch (error) {
    console.error(`${LOG} clipboard.write failed:`, error);
    return false;
  }
}

/**
 * Capture after structures are painted into dynamic2D, and after Pixi uploads
 * that texture (`frame:render` fires just before `texture.update` + render —
 * wait a microtask so the WebGL backdrop matches the same frame).
 */
export function captureSelectionPng(
  api: SandkitApi,
  bounds: CellBounds,
): Promise<"ok" | "no-canvas" | "out-of-view" | "blank" | "failed"> {
  console.log(`${LOG} capture start (dynamic2D + no overlay)`, { bounds });

  return new Promise((resolve) => {
    let settled = false;
    const finish = (
      result: "ok" | "no-canvas" | "out-of-view" | "blank" | "failed",
    ) => {
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
      queueMicrotask(() => {
        void (async () => {
          if (!getDynamic2DCanvas()) {
            finish("no-canvas");
            return;
          }
          const screenRect = getSelectionScreenRect(api, bounds);
          if (!screenRect) {
            finish("failed");
            return;
          }
          const dyn = getDynamic2DCanvas();
          if (
            dyn &&
            clipRectToCanvas(screenRect, dyn.width, dyn.height) == null
          ) {
            finish("out-of-view");
            return;
          }
          const raster = rasterizeSelection(api, bounds);
          if (!raster) {
            finish("blank");
            return;
          }
          const ok = await copyPngToClipboard(raster);
          finish(ok ? "ok" : "failed");
        })();
      });
    });
  });
}
