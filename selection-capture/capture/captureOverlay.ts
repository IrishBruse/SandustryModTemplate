import type { CaptureOverlaySettings } from "./captureSettings";
import type { ScreenRect } from "./captureFrame";

/** Starter markup for advanced mode. Animations rasterize as a still frame in PNG/GIF. */
export const DEFAULT_ADVANCED_OVERLAY_HTML = `<style>
  @keyframes pixel-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  @keyframes sand-flow {
    0% { transform: translateY(-4px); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(6px); opacity: 0; }
  }

  @keyframes alert-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }

  @property --sand {
    syntax: "<integer>";
    initial-value: 980;
    inherits: false;
  }

  @keyframes sand-count {
    from { --sand: 980; }
    to { --sand: 1420; }
  }

  .sand-hud {
    position: absolute;
    inset: 0;
    pointer-events: none;
    font-family: monospace;
    font-size: 11px;
    color: #e0e0e0;
    image-rendering: pixelated;
    box-sizing: border-box;
    padding: 10px;
  }

  /* Top Left: Sand Counter */
  .hud-top {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .hud-badge {
    background: #181824;
    border: 2px solid #3b3b4f;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 2px 2px 0px #000;
  }

  .sand-stream {
    position: relative;
    width: 6px;
    height: 10px;
    background: #2a2a3d;
    overflow: hidden;
  }

  .sand-grain {
    position: absolute;
    left: 2px;
    width: 2px;
    height: 2px;
    background: #ffaa00;
    animation: sand-flow 0.8s steps(4) infinite;
  }
  .sand-grain:nth-child(2) { animation-delay: 0.4s; }

  .stat-label { color: #8888a0; }
  .stat-val {
    color: #ffffff;
    font-weight: bold;
    min-width: 4ch;
    animation: sand-count 14s linear infinite alternate;
    counter-reset: sand var(--sand);
  }
  .stat-val::after { content: counter(sand); }

  /* Bottom Right: Warning */
  .hud-bottom {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .warning-bar {
    background: #2a1515;
    border: 2px solid #ff3c3c;
    color: #ff5555;
    padding: 4px 8px;
    font-size: 10px;
    font-weight: bold;
    box-shadow: 2px 2px 0px #000;
    animation: alert-bounce 0.6s steps(2) infinite;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .alert-dot {
    width: 4px;
    height: 4px;
    background: #ff3c3c;
    animation: pixel-blink 0.4s steps(1) infinite;
  }
</style>

<div class="sand-hud">
  <div class="hud-top">
    <div class="hud-badge">
      <div class="sand-stream">
        <div class="sand-grain"></div>
        <div class="sand-grain"></div>
      </div>
      <span class="stat-label">SAND:</span>
      <span class="stat-val"></span>
    </div>
  </div>

  <div class="hud-bottom">
    <div class="warning-bar">
      <div class="alert-dot"></div>
      <span>OVERFLOW WARNING</span>
    </div>
  </div>
</div>`;

const XHTML_NS = "http://www.w3.org/1999/xhtml";

const advancedPreviewCache = new Map<string, ImageData>();
const advancedPreviewInflight = new Set<string>();

function clampAlignPercent(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function escapeOverlayText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Inner HTML for the position:relative overlay frame (simple mode). */
export function buildSimpleOverlayHtml(
  text: string,
  verticalAlign: number,
  horizontalAlign: number,
  fontSize: number,
): string {
  const y = clampAlignPercent(verticalAlign, 88);
  const x = clampAlignPercent(horizontalAlign, 0);
  const escaped = escapeOverlayText(text);
  return `<div style="position:absolute;inset:0;pointer-events:none;">
  <div style="
    position:absolute;
    left:${x}%;
    top:${y}%;
    transform:translate(-${x}%, -${y}%);
    max-width:100%;
    color:#fff;
    font:600 ${fontSize}px/1.2 system-ui,-apple-system,sans-serif;
    text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
    white-space:pre-wrap;
    word-break:break-word;
  ">${escaped}</div>
</div>`;
}

export function resolveOverlayInnerHtml(settings: CaptureOverlaySettings): string | null {
  if (!settings.enabled) return null;
  if (settings.advanced) {
    const html = settings.html.trim();
    return html || null;
  }
  const text = settings.text.trim();
  if (!text) return null;
  return buildSimpleOverlayHtml(
    text,
    settings.verticalAlign,
    settings.horizontalAlign,
    settings.fontSize,
  );
}

export function overlayRasterCacheKey(
  settings: CaptureOverlaySettings,
  width: number,
  height: number,
): string {
  if (!settings.advanced) {
    return `${width}x${height}:simple:${settings.text}:${settings.verticalAlign}:${settings.horizontalAlign}:${settings.fontSize}`;
  }
  const innerHtml = settings.html.trim();
  return `${width}x${height}:advanced:${innerHtml}`;
}

function cloneImageData(image: ImageData): ImageData {
  return new ImageData(new Uint8ClampedArray(image.data), image.width, image.height);
}

/** Alpha-composite overlay onto base without drawing foreign pixels onto the game canvas. */
export function blendSourceOverImageData(base: ImageData, overlay: ImageData): ImageData {
  if (base.width !== overlay.width || base.height !== overlay.height) return cloneImageData(base);

  const out = cloneImageData(base);
  const bd = base.data;
  const od = overlay.data;
  const dst = out.data;
  for (let i = 0; i < bd.length; i += 4) {
    const sa = od[i + 3];
    if (sa === 0) continue;
    if (sa === 255) {
      dst[i] = od[i];
      dst[i + 1] = od[i + 1];
      dst[i + 2] = od[i + 2];
      dst[i + 3] = 255;
      continue;
    }

    const da = bd[i + 3];
    const saNorm = sa / 255;
    const daNorm = da / 255;
    const outAlpha = saNorm + daNorm * (1 - saNorm);
    if (outAlpha <= 0) {
      dst[i + 3] = 0;
      continue;
    }

    dst[i] = Math.round((od[i] * saNorm + bd[i] * daNorm * (1 - saNorm)) / outAlpha);
    dst[i + 1] = Math.round((od[i + 1] * saNorm + bd[i + 1] * daNorm * (1 - saNorm)) / outAlpha);
    dst[i + 2] = Math.round((od[i + 2] * saNorm + bd[i + 2] * daNorm * (1 - saNorm)) / outAlpha);
    dst[i + 3] = Math.round(outAlpha * 255);
  }
  return out;
}

function simpleFont(fontSize: number): string {
  return `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
}

function simpleLineHeight(fontSize: number): number {
  return fontSize * 1.2;
}

function wrapOverlayLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = words[0]!;
    for (let i = 1; i < words.length; i++) {
      const next = `${current} ${words[i]!}`;
      if (ctx.measureText(next).width <= maxWidth) {
        current = next;
      } else {
        lines.push(current);
        current = words[i]!;
      }
    }
    lines.push(current);
  }
  return lines.length > 0 ? lines : [""];
}

function drawSimpleOverlayText(
  ctx: CanvasRenderingContext2D,
  text: string,
  verticalAlign: number,
  horizontalAlign: number,
  fontSize: number,
  width: number,
  height: number,
): void {
  const vPct = clampAlignPercent(verticalAlign, 88) / 100;
  const hPct = clampAlignPercent(horizontalAlign, 0) / 100;
  const maxTextWidth = Math.max(1, width);
  const font = simpleFont(fontSize);
  ctx.font = font;
  const lines = wrapOverlayLines(ctx, text, maxTextWidth);
  const lineHeight = simpleLineHeight(fontSize);
  const textHeight = lines.length * lineHeight;
  const blockTop = Math.round(vPct * Math.max(0, height - textHeight));

  ctx.font = font;
  ctx.textBaseline = "top";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(2, Math.round(fontSize / 10));
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#ffffff";

  let textY = blockTop;
  for (const line of lines) {
    const lineWidth = ctx.measureText(line).width;
    const textX = Math.round(hPct * Math.max(0, width - lineWidth));
    ctx.strokeText(line, textX, textY);
    ctx.fillText(line, textX, textY);
    textY += lineHeight;
  }
}

/** Draw simple caption on the overlay canvas (same path as capture compositing). */
export function drawSimpleOverlayInScreenRect(
  ctx: CanvasRenderingContext2D,
  settings: CaptureOverlaySettings,
  rect: ScreenRect,
): void {
  if (!settings.enabled || settings.advanced) return;
  const text = settings.text.trim();
  if (!text || rect.width <= 0 || rect.height <= 0) return;

  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.width, rect.height);
  ctx.clip();
  ctx.translate(rect.x, rect.y);
  drawSimpleOverlayText(
    ctx,
    text,
    settings.verticalAlign,
    settings.horizontalAlign,
    settings.fontSize,
    rect.width,
    rect.height,
  );
  ctx.restore();
}

function ensureAdvancedPreviewRaster(
  settings: CaptureOverlaySettings,
  width: number,
  height: number,
): void {
  const html = settings.html.trim();
  if (!html || width <= 0 || height <= 0) return;

  const key = overlayRasterCacheKey(settings, width, height);
  if (advancedPreviewCache.has(key) || advancedPreviewInflight.has(key)) return;

  advancedPreviewInflight.add(key);
  void rasterizeAdvancedOverlay(html, width, height).then((data) => {
    advancedPreviewInflight.delete(key);
    if (data) advancedPreviewCache.set(key, cloneImageData(data));
  });
}

/** Draw advanced overlay on the overlay canvas (async raster, cached per size + HTML). */
export function drawAdvancedOverlayInScreenRect(
  ctx: CanvasRenderingContext2D,
  settings: CaptureOverlaySettings,
  rect: ScreenRect,
): void {
  if (!settings.enabled || !settings.advanced) return;
  const html = settings.html.trim();
  if (!html || rect.width <= 0 || rect.height <= 0) return;

  ensureAdvancedPreviewRaster(settings, rect.width, rect.height);
  const cached = advancedPreviewCache.get(overlayRasterCacheKey(settings, rect.width, rect.height));
  if (!cached) return;

  ctx.putImageData(cached, rect.x, rect.y);
}

/** Live preview for simple or advanced overlay inside the capture area. */
export function drawOverlayPreviewInScreenRect(
  ctx: CanvasRenderingContext2D,
  settings: CaptureOverlaySettings,
  rect: ScreenRect,
): void {
  if (!settings.enabled) return;
  if (settings.advanced) drawAdvancedOverlayInScreenRect(ctx, settings, rect);
  else drawSimpleOverlayInScreenRect(ctx, settings, rect);
}

/** Simple overlay via canvas 2D — avoids SVG foreignObject taint on readback. */
function rasterizeSimpleOverlay(
  text: string,
  verticalAlign: number,
  horizontalAlign: number,
  fontSize: number,
  width: number,
  height: number,
): ImageData | null {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  drawSimpleOverlayText(ctx, text, verticalAlign, horizontalAlign, fontSize, width, height);
  return ctx.getImageData(0, 0, width, height);
}

function wrapOverlayFrame(innerHtml: string, width: number, height: number): string {
  return buildAdvancedOverlayFrameHtml(innerHtml, width, height, true);
}

/** position:relative frame for advanced overlay HTML (DOM preview or SVG raster). */
export function buildAdvancedOverlayFrameHtml(
  innerHtml: string,
  width: number,
  height: number,
  forSvg = false,
): string {
  const xmlns = forSvg ? ` xmlns="${XHTML_NS}"` : "";
  return `<div${xmlns} style="
    position:relative;
    width:${width}px;
    height:${height}px;
    overflow:hidden;
    margin:0;
    padding:0;
    box-sizing:border-box;
    font:16px/normal system-ui,sans-serif;
    color:#000;
  ">${innerHtml}</div>`;
}

function readImageFromSvg(svg: string, width: number, height: number): Promise<ImageData | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Embedded @font-face in SVG-as-image can finish after the first paint.
      requestAnimationFrame(() => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          resolve(ctx.getImageData(0, 0, width, height));
        } catch (error) {
          console.warn("advanced overlay readback failed:", error);
          resolve(null);
        }
      });
    };
    img.onerror = () => {
      console.warn("advanced overlay SVG load failed");
      resolve(null);
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

/** Rasterize an XHTML root inside SVG foreignObject. */
export async function rasterizeForeignHtml(
  rootHtml: string,
  width: number,
  height: number,
): Promise<ImageData | null> {
  if (width <= 0 || height <= 0 || !rootHtml.trim()) return null;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <foreignObject width="100%" height="100%">
    ${rootHtml}
  </foreignObject>
</svg>`;
  return readImageFromSvg(svg, width, height);
}

/** Advanced overlay via SVG foreignObject; pixels are read on an isolated canvas. */
async function rasterizeAdvancedOverlay(
  innerHtml: string,
  width: number,
  height: number,
): Promise<ImageData | null> {
  if (width <= 0 || height <= 0 || !innerHtml.trim()) return null;
  return rasterizeForeignHtml(wrapOverlayFrame(innerHtml, width, height), width, height);
}

async function rasterizeOverlayImageData(
  settings: CaptureOverlaySettings,
  width: number,
  height: number,
): Promise<ImageData | null> {
  if (!settings.advanced) {
    const text = settings.text.trim();
    if (!text) return null;
    return rasterizeSimpleOverlay(
      text,
      settings.verticalAlign,
      settings.horizontalAlign,
      settings.fontSize,
      width,
      height,
    );
  }
  const html = settings.html.trim();
  if (!html) return null;
  return rasterizeAdvancedOverlay(html, width, height);
}

export async function getOverlayImageData(
  settings: CaptureOverlaySettings,
  width: number,
  height: number,
  cache?: Map<string, ImageData>,
): Promise<ImageData | null> {
  if (!settings.enabled) return null;

  const key = overlayRasterCacheKey(settings, width, height);
  const cached = cache?.get(key);
  if (cached) return cached;

  const raster = await rasterizeOverlayImageData(settings, width, height);
  if (!raster) return null;

  const copy = cloneImageData(raster);
  cache?.set(key, copy);
  return copy;
}

export async function applyOverlayToImageData(
  base: ImageData,
  settings: CaptureOverlaySettings,
  cache?: Map<string, ImageData>,
  liveOverlay?: ImageData | null,
): Promise<ImageData> {
  if (!settings.enabled) return base;
  const overlay =
    liveOverlay && liveOverlay.width === base.width && liveOverlay.height === base.height
      ? liveOverlay
      : await getOverlayImageData(settings, base.width, base.height, cache);
  if (!overlay) return base;
  return blendSourceOverImageData(base, overlay);
}

export async function applyOverlayToCanvas(
  canvas: HTMLCanvasElement,
  settings: CaptureOverlaySettings,
  cache?: Map<string, ImageData>,
): Promise<boolean> {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return false;

  let base: ImageData;
  try {
    base = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    console.warn("capture readback failed before overlay:", error);
    return false;
  }

  const blended = await applyOverlayToImageData(base, settings, cache);
  if (blended === base) return false;
  ctx.putImageData(blended, 0, 0);
  return true;
}

export async function applyOverlayToRgba(
  rgba: { data: Uint8ClampedArray; width: number; height: number },
  settings: CaptureOverlaySettings,
  cache?: Map<string, ImageData>,
): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  const base = new ImageData(new Uint8ClampedArray(rgba.data), rgba.width, rgba.height);
  const blended = await applyOverlayToImageData(base, settings, cache);
  return { data: blended.data, width: blended.width, height: blended.height };
}
