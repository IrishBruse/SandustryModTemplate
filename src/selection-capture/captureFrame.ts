import type { CellBounds } from "./selectionBounds";

/** Sky fill when the WebGL backdrop cannot be sampled. */
const FALLBACK_SKY = "#3d6b78";

/** Chroma-key fill when **Greenscreen** is on. */
const GREENSCREEN = "#00ff00";

export type CaptureLook = {
  greenscreen: boolean;
  showMouse: boolean;
};

/** Extra screen pixels on each edge so structure outlines are not clipped. */
export const BORDER_PX = 1;

type VisibleNode = { visible?: boolean; parent?: { filters?: unknown[] | null } };

type SessionPixi = {
  app?: {
    canvas?: HTMLCanvasElement;
    view?: HTMLCanvasElement;
    renderer?: {
      events?: {
        cursorStyles?: { default?: string };
        currentCursor?: string;
      };
    };
  };
  cursors?: {
    default?: string;
    marquee?: string;
    demolish?: string;
  };
  dynamic2D?: {
    context?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  };
  mountainsSprite?: VisibleNode;
  treesSmallSprite?: VisibleNode;
  treesSprite?: VisibleNode;
  bgL04Sprite?: VisibleNode;
  bgL04Extension?: VisibleNode;
  edgeMist?: { sprite?: VisibleNode };
  toggleSkyFilter?: (enabled: boolean) => void;
};

type SessionImage = { image?: HTMLImageElement | CanvasImageSource };

type SessionRendering = {
  canvas?: HTMLCanvasElement;
  pixi?: SessionPixi;
  images?: Record<string, SessionImage | undefined>;
};

type SessionShape = {
  paused?: boolean;
  settings?: { cursorScale?: number };
  input?: {
    mouse?: {
      position?: { x?: number; y?: number };
      available?: boolean;
    };
  };
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

function backgroundNodes(pixi: SessionPixi): VisibleNode[] {
  const nodes: VisibleNode[] = [];
  for (const node of [
    pixi.mountainsSprite,
    pixi.treesSmallSprite,
    pixi.treesSprite,
    pixi.bgL04Sprite,
    pixi.bgL04Extension,
    pixi.edgeMist?.sprite,
  ]) {
    if (node) nodes.push(node);
  }
  return nodes;
}

/**
 * Hide parallax + sky shader for a chroma-key fill.
 * Call the returned function to restore.
 */
export function applyCaptureLook(look: CaptureLook): () => void {
  const restores: Array<() => void> = [];

  if (look.greenscreen) {
    const pixi = getSession()?.rendering?.pixi;
    const previousBody = document.body.style.backgroundColor;
    if (pixi) {
      const nodes = backgroundNodes(pixi);
      const visibility = nodes.map((node) => node.visible !== false);
      const layer = pixi.mountainsSprite?.parent;
      const previousFilters = layer?.filters ?? null;
      for (const node of nodes) node.visible = false;
      pixi.toggleSkyFilter?.(false);
      restores.push(() => {
        nodes.forEach((node, i) => {
          node.visible = visibility[i];
        });
        if (layer) layer.filters = previousFilters;
        else pixi.toggleSkyFilter?.(previousFilters != null && previousFilters.length > 0);
      });
    }
    document.body.style.backgroundColor = GREENSCREEN;
    restores.push(() => {
      document.body.style.backgroundColor = previousBody;
    });
  }

  let restored = false;
  return () => {
    if (restored) return;
    restored = true;
    for (let i = restores.length - 1; i >= 0; i--) restores[i]();
  };
}

export type ScreenRect = { x: number; y: number; width: number; height: number };

/** Map inclusive cell AABB corners (in draw pixels) to a crop rect with a 1 px border. */
export function screenRectFromCellCorners(
  topLeft: { x: number; y: number },
  bottomRight: { x: number; y: number },
): ScreenRect | null {
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

export function getSelectionScreenRect(api: SandkitApi, bounds: CellBounds): ScreenRect | null {
  return screenRectFromCellCorners(
    api.rendering.getDrawPositionAtCell(bounds.minX, bounds.minY),
    api.rendering.getDrawPositionAtCell(bounds.maxX + 1, bounds.maxY + 1),
  );
}

export function clipRectToCanvas(
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

type CursorKey = "default" | "marquee" | "demolish";

const CURSOR_PATHS: Record<Exclude<CursorKey, "default">, string> = {
  marquee: "img/cursor_marquee.png",
  demolish: "img/cursor_demolish.png",
};

const pathCursorCache = new Map<string, HTMLImageElement>();

function resolveActiveCursorKey(pixi: SessionPixi | undefined): CursorKey {
  const style =
    pixi?.app?.renderer?.events?.cursorStyles?.default ??
    pixi?.app?.renderer?.events?.currentCursor ??
    pixi?.cursors?.default ??
    "";
  const text = String(style);
  if (text.includes("marquee") || text === pixi?.cursors?.marquee) return "marquee";
  if (text.includes("demolish") || text === pixi?.cursors?.demolish) return "demolish";
  return "default";
}

function isDrawableImage(image: CanvasImageSource | undefined): image is CanvasImageSource {
  if (!image) return false;
  if (image instanceof HTMLImageElement) {
    return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
  }
  if (image instanceof HTMLCanvasElement || image instanceof OffscreenCanvas) {
    return image.width > 0 && image.height > 0;
  }
  return true;
}

function imageNaturalSize(image: CanvasImageSource): { width: number; height: number } | null {
  if (image instanceof HTMLImageElement) {
    return { width: image.naturalWidth, height: image.naturalHeight };
  }
  if ("width" in image && "height" in image) {
    const width = Number(image.width);
    const height = Number(image.height);
    if (width > 0 && height > 0) return { width, height };
  }
  return null;
}

function getCursorImage(key: CursorKey): CanvasImageSource | null {
  const session = getSession();
  if (key === "default") {
    const image = session?.rendering?.images?.cursor_default?.image;
    return isDrawableImage(image) ? image : null;
  }

  const path = CURSOR_PATHS[key];
  let cached = pathCursorCache.get(path);
  if (!cached) {
    cached = new Image();
    cached.src = path;
    pathCursorCache.set(path, cached);
  }
  return isDrawableImage(cached) ? cached : null;
}

/**
 * Paint the in-game CSS cursor into the 1× crop (hotspot = top-left).
 * Skips when the tip is outside the crop or the image is not ready.
 */
function drawMouseCursor(
  ctx: CanvasRenderingContext2D,
  clip: ScreenRect,
  cropWidth: number,
  cropHeight: number,
): void {
  const session = getSession();
  const mouse = session?.input?.mouse;
  if (mouse?.available === false) return;
  const mx = mouse?.position?.x;
  const my = mouse?.position?.y;
  if (!Number.isFinite(mx) || !Number.isFinite(my)) return;

  const localX = (mx as number) - clip.x;
  const localY = (my as number) - clip.y;
  if (localX < 0 || localY < 0 || localX >= cropWidth || localY >= cropHeight) return;

  const key = resolveActiveCursorKey(session?.rendering?.pixi);
  const image = getCursorImage(key) ?? getCursorImage("default");
  if (!image) return;

  const natural = imageNaturalSize(image);
  if (!natural) return;

  const scale = Math.max(1, Number(session?.settings?.cursorScale) || 1);
  const width = Math.max(1, Math.round(natural.width * scale));
  const height = Math.max(1, Math.round(natural.height * scale));

  const previousSmooth = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  try {
    ctx.drawImage(image, localX, localY, width, height);
  } catch (error) {
    console.warn(`cursor draw failed:`, error);
  } finally {
    ctx.imageSmoothingEnabled = previousSmooth;
  }
}

let cropScratch: HTMLCanvasElement | null = null;
let scaleScratch: HTMLCanvasElement | null = null;

function scratchCanvas(slot: "crop" | "scale", width: number, height: number): HTMLCanvasElement {
  const previous = slot === "crop" ? cropScratch : scaleScratch;
  const canvas = previous ?? document.createElement("canvas");
  if (slot === "crop") cropScratch = canvas;
  else scaleScratch = canvas;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return canvas;
}

/**
 * Copy pixels on the first microtask after `frame:render`.
 * That event fires just before `texture.update` + Pixi render — a sync read is
 * still the sky clear. Waiting an extra `await` hop is too late (WebGL buffer gone).
 *
 * `onPaint` runs in the render listener (before the copy) so the sim can pause
 * while a large crop is still on the main thread.
 */
export function rasterizeOnPaint(
  api: SandkitApi,
  bounds: CellBounds,
  scale: number,
  onPaint?: () => void,
  look?: CaptureLook,
): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timeoutId = 0;
    const unsubscribe = api.events.on("frame:render", () => {
      unsubscribe();
      onPaint?.();
      queueMicrotask(() => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        try {
          resolve(rasterizeSelection(api, bounds, scale, look));
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

/** 1× crop pixels after paint. Does not upscale — GIF encode scales later. */
export function snapshotOnPaint(
  api: SandkitApi,
  bounds: CellBounds,
  onPaint?: () => void,
  look?: CaptureLook,
): Promise<ImageData | null> {
  return rasterizeOnPaint(api, bounds, 1, onPaint, look).then((canvas) => {
    if (!canvas) return null;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  });
}

/**
 * Crop the selection from the live game canvases, then nearest-neighbor upscale.
 */
export function rasterizeSelection(
  api: SandkitApi,
  bounds: CellBounds,
  scale: number,
  look?: CaptureLook,
): HTMLCanvasElement | null {
  const screenRect = getSelectionScreenRect(api, bounds);
  if (!screenRect) {
    console.warn(`could not map cell bounds to screen`);
    return null;
  }

  const dynamicCanvas = getDynamic2DCanvas();
  if (!dynamicCanvas) {
    console.warn(`dynamic2D canvas missing`);
    return null;
  }

  const clip = clipRectToCanvas(screenRect, dynamicCanvas.width, dynamicCanvas.height);
  if (!clip) {
    console.warn(`selection off-screen`, { screenRect });
    return null;
  }

  const out = scratchCanvas("crop", clip.width, clip.height);
  const ctx = out.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = look?.greenscreen ? GREENSCREEN : FALLBACK_SKY;
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
      console.warn(`WebGL backdrop draw failed:`, error);
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
    console.error(`dynamic2D draw failed:`, error);
    return null;
  }

  if (look?.showMouse) {
    drawMouseCursor(ctx, clip, out.width, out.height);
  }

  const pixelScale = Math.max(1, Math.round(scale));
  if (pixelScale === 1) return out;

  const scaled = scratchCanvas("scale", out.width * pixelScale, out.height * pixelScale);
  const scaledCtx = scaled.getContext("2d");
  if (!scaledCtx) return out;
  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(out, 0, 0, scaled.width, scaled.height);
  return scaled;
}
