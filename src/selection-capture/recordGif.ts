import { encode, type UnencodedFrame } from "modern-gif";
import { applyCaptureLook, getSession, snapshotOnPaint, type CaptureLook } from "./captureFrame";
import { MOD_ID } from "./globals";
import {
  getSelectionCellBounds,
  restoreMarqueeSelection,
  snapshotMarqueeSelection,
  type CellBounds,
} from "./selectionBounds";

const LOG = `[${MOD_ID}]`;

const MIN_FRAMES = 2;
const MAX_FRAMES = 120;
const MIN_TICKS = 1;
const MAX_TICKS = 30;
/** Same nearest-neighbor scale as the PNG screenshot. */
const GIF_SCALE = 2;

/**
 * WorkerMessage.SetPaused in the current game bundle (`dist/js/bundle.js`).
 * Pause must also reach the simulation worker — `session.paused` alone is not enough.
 */
const WORKER_SET_PAUSED = 54;

export type RecordGifOptions = {
  frames: number;
  ticksPerFrame: number;
  freezeBackground: boolean;
  greenscreen: boolean;
};

export type RecordGifResult = "ok" | "downloaded" | "no-selection" | "out-of-view" | "failed";

type EnvironmentShape = {
  multithreading?: {
    simulation?: {
      manager?: { postMessage: (data: unknown) => void };
    };
  };
};

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function setSimulationPaused(paused: boolean): void {
  const session = getSession();
  if (session) session.paused = paused;

  const environment = sandkit.state.environment as EnvironmentShape;
  const manager = environment.multithreading?.simulation?.manager;
  if (!manager?.postMessage) return;
  try {
    manager.postMessage([WORKER_SET_PAUSED, paused]);
  } catch (error) {
    console.warn(`${LOG} SetPaused worker message failed:`, error);
  }
}

function waitTicks(api: SandkitApi, count: number): Promise<void> {
  return new Promise((resolve, reject) => {
    let left = count;
    const timeoutId = setTimeout(() => {
      setSimulationPaused(true);
      reject(new Error("tick wait timed out"));
    }, 15_000);

    const step = () => {
      left -= 1;
      if (left <= 0) {
        clearTimeout(timeoutId);
        // Stay unpaused so this tick can paint before we capture.
        resolve();
        return;
      }
      api.schedule.nextTick(step);
    };

    api.schedule.nextTick(step);
    setSimulationPaused(false);
  });
}

async function captureGifFrame(
  api: SandkitApi,
  bounds: CellBounds,
  look: CaptureLook,
): Promise<ImageData | null> {
  if (getSession()?.paused === true) setSimulationPaused(false);
  const snap = () => snapshotOnPaint(api, bounds, () => setSimulationPaused(true), look);
  try {
    return await snap();
  } catch (error) {
    console.warn(`${LOG} paint wait failed, retry:`, error);
    setSimulationPaused(false);
    try {
      return await snap();
    } catch (retryError) {
      console.warn(`${LOG} paint wait failed:`, retryError);
      return null;
    }
  }
}

function canvasToRgba(canvas: HTMLCanvasElement): {
  data: Uint8ClampedArray;
  width: number;
  height: number;
} | null {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { data: image.data, width: image.width, height: image.height };
}

let encodeScratch: HTMLCanvasElement | null = null;
let encodeScaleScratch: HTMLCanvasElement | null = null;

function gifScratch(slot: "src" | "scaled", width: number, height: number): HTMLCanvasElement {
  const previous = slot === "src" ? encodeScratch : encodeScaleScratch;
  const canvas = previous ?? document.createElement("canvas");
  if (slot === "src") encodeScratch = canvas;
  else encodeScaleScratch = canvas;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return canvas;
}

function frameToRgba(
  frame: ImageData,
): { data: Uint8ClampedArray; width: number; height: number } | null {
  const src = gifScratch("src", frame.width, frame.height);
  const srcCtx = src.getContext("2d", { willReadFrequently: true });
  if (!srcCtx) return null;
  srcCtx.putImageData(frame, 0, 0);

  const scaled = gifScratch("scaled", frame.width * GIF_SCALE, frame.height * GIF_SCALE);
  const scaledCtx = scaled.getContext("2d", { willReadFrequently: true });
  if (!scaledCtx) return null;
  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(src, 0, 0, scaled.width, scaled.height);
  return canvasToRgba(scaled);
}

async function encodeGif(frames: ImageData[], delayMs: number): Promise<Uint8Array | null> {
  if (frames.length === 0) return null;

  const prepared: UnencodedFrame[] = [];
  let width = 0;
  let height = 0;
  for (const frame of frames) {
    const rgba = frameToRgba(frame);
    if (!rgba) return null;
    width = rgba.width;
    height = rgba.height;
    // Scratch canvases reuse the same backing store — copy before the next frame.
    // Cast: TS types Uint8ClampedArray.buffer as ArrayBufferLike; modern-gif wants BufferSource.
    const data = new Uint8ClampedArray(rgba.data) as UnencodedFrame["data"];
    prepared.push({
      data,
      delay: delayMs,
      disposal: 1,
    });
  }

  const buffer = await encode({
    width,
    height,
    frames: prepared,
    maxColors: 255,
    looped: true,
  });
  return new Uint8Array(buffer);
}

function bytesToGifBlob(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: "image/gif" });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Chromium / Electron rejects `image/gif` on `clipboard.write`.
 * PNG is accepted (same as the screenshot example). HTML carries the GIF for apps that read it.
 */
async function copyGifToClipboard(bytes: Uint8Array, preview: HTMLCanvasElement): Promise<boolean> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    console.error(`${LOG} clipboard image write unavailable`);
    return false;
  }

  const gifBlob = bytesToGifBlob(bytes);
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/gif": Promise.resolve(gifBlob) })]);
    console.log(`${LOG} copied GIF to clipboard`, { bytes: gifBlob.size });
    return true;
  } catch (error) {
    console.warn(`${LOG} image/gif not accepted:`, error);
  }

  const pngBlob = await canvasToPngBlob(preview);
  if (!pngBlob) return false;

  try {
    const html = `<img src="data:image/gif;base64,${bytesToBase64(bytes)}" alt="" />`;
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": Promise.resolve(pngBlob),
        "text/html": Promise.resolve(new Blob([html], { type: "text/html" })),
      }),
    ]);
    console.log(`${LOG} copied PNG+HTML clipboard`, { png: pngBlob.size, gif: gifBlob.size });
    return true;
  } catch (error) {
    console.warn(`${LOG} PNG+HTML clipboard failed:`, error);
  }

  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": Promise.resolve(pngBlob) })]);
    console.log(`${LOG} copied PNG to clipboard`, { bytes: pngBlob.size });
    return true;
  } catch (error) {
    console.error(`${LOG} clipboard.write failed:`, error);
    return false;
  }
}

function downloadGif(bytes: Uint8Array): void {
  const blob = bytesToGifBlob(bytes);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  link.download = `sandustry-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.gif`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Pause, capture N frames with `ticksPerFrame` sim ticks between them, encode a GIF, copy it.
 */
export async function recordSelectionGif(
  api: SandkitApi,
  options: RecordGifOptions,
): Promise<RecordGifResult> {
  const framesWanted = clampInt(options.frames, MIN_FRAMES, MAX_FRAMES);
  const ticksPerFrame = clampInt(options.ticksPerFrame, MIN_TICKS, MAX_TICKS);
  const delayMs = Math.max(20, ticksPerFrame * 20);
  const look: CaptureLook = {
    freezeBackground: options.freezeBackground,
    greenscreen: options.greenscreen,
  };

  const bounds = getSelectionCellBounds(api);
  if (!bounds) {
    console.warn(`${LOG} no selection bounds`);
    return "no-selection";
  }

  const marquee = snapshotMarqueeSelection();
  const wasPaused = getSession()?.paused === true;
  console.log(`${LOG} record start`, {
    bounds,
    framesWanted,
    ticksPerFrame,
    freezeBackground: look.freezeBackground,
    greenscreen: look.greenscreen,
  });

  const frames: ImageData[] = [];
  const restoreLook = applyCaptureLook(look);
  try {
    try {
      const first = await captureGifFrame(api, bounds, look);
      if (!first) return "out-of-view";
      frames.push(first);

      for (let i = 1; i < framesWanted; i++) {
        await waitTicks(api, ticksPerFrame);
        const frame = await captureGifFrame(api, bounds, look);
        if (!frame) {
          console.warn(`${LOG} frame ${i + 1} missing — abort`);
          return "failed";
        }
        frames.push(frame);
        if (i === 1 || i % 10 === 0) {
          console.log(`${LOG} captured frame ${i + 1}/${framesWanted}`);
        }
      }
    } finally {
      restoreLook();
    }

    if (frames.length < 2) return "failed";

    api.ui.toast("Encoding GIF…", {});
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    const bytes = await encodeGif(frames, delayMs);
    if (!bytes) return "failed";

    downloadGif(bytes);
    if (!frameToRgba(frames[0])) return "failed";
    const previewCanvas = encodeScaleScratch;
    if (!previewCanvas) return "failed";
    const copied = await copyGifToClipboard(bytes, previewCanvas);
    console.log(`${LOG} GIF ready`, {
      frames: frames.length,
      bytes: bytes.byteLength,
      copied,
    });
    return copied ? "ok" : "downloaded";
  } catch (error) {
    console.error(`${LOG} record threw:`, error);
    return "failed";
  } finally {
    if (marquee) restoreMarqueeSelection(api, marquee, bounds);
    setSimulationPaused(wasPaused);
  }
}
