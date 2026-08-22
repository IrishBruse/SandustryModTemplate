import { GIFEncoder, applyPalette, quantize } from "gifenc";
import { getSession, rasterizeOnPaint } from "./captureFrame";
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
const ALLOWED_SCALES = [1, 2, 4] as const;

/**
 * WorkerMessage.SetPaused in the current game bundle (`dist/js/bundle.js`).
 * Pause must also reach the simulation worker — `session.paused` alone is not enough.
 */
const WORKER_SET_PAUSED = 54;

export type RecordGifOptions = {
  frames: number;
  ticksPerFrame: number;
  scale: number;
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

function clampScale(value: number): number {
  const n = Math.round(value);
  if (ALLOWED_SCALES.includes(n as (typeof ALLOWED_SCALES)[number])) return n;
  return 2;
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

async function capturePaintedFrame(
  api: SandkitApi,
  bounds: CellBounds,
  scale: number,
): Promise<HTMLCanvasElement | null> {
  const wasPaused = getSession()?.paused === true;
  if (wasPaused) setSimulationPaused(false);
  try {
    return await rasterizeOnPaint(api, bounds, scale);
  } catch (error) {
    console.warn(`${LOG} first paint wait failed:`, error);
    return null;
  } finally {
    if (wasPaused) setSimulationPaused(true);
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

function sampleFramesForPalette(frames: HTMLCanvasElement[]): Uint8ClampedArray | null {
  const chunks: Uint8ClampedArray[] = [];
  for (const frame of frames) {
    const rgba = canvasToRgba(frame);
    if (!rgba) continue;
    const pixels = rgba.width * rgba.height;
    const step = Math.max(1, Math.floor(pixels / 4000));
    const out = new Uint8ClampedArray(Math.ceil(pixels / step) * 4);
    let o = 0;
    for (let p = 0; p < pixels; p += step) {
      const i = p * 4;
      out[o] = rgba.data[i];
      out[o + 1] = rgba.data[i + 1];
      out[o + 2] = rgba.data[i + 2];
      out[o + 3] = rgba.data[i + 3];
      o += 4;
    }
    chunks.push(out.subarray(0, o));
  }
  if (chunks.length === 0) return null;
  const combined = new Uint8ClampedArray(chunks.reduce((n, chunk) => n + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }
  return combined;
}

function encodeGif(frames: HTMLCanvasElement[], delayMs: number): Uint8Array | null {
  if (frames.length === 0) return null;
  const sample = sampleFramesForPalette(frames);
  if (!sample) return null;
  const palette = quantize(sample, 256);
  const gif = GIFEncoder();
  for (let i = 0; i < frames.length; i++) {
    const rgba = canvasToRgba(frames[i]);
    if (!rgba) return null;
    const index = applyPalette(rgba.data, palette);
    gif.writeFrame(index, rgba.width, rgba.height, {
      palette: i === 0 ? palette : undefined,
      delay: delayMs,
      repeat: i === 0 ? 0 : undefined,
      dispose: 1,
    });
  }
  gif.finish();
  return gif.bytes();
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
  const scale = clampScale(options.scale);
  const delayMs = Math.max(20, ticksPerFrame * 20);

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
    scale,
  });

  const frames: HTMLCanvasElement[] = [];
  try {
    const first = await capturePaintedFrame(api, bounds, scale);
    if (!first) return "out-of-view";
    frames.push(first);
    setSimulationPaused(true);

    for (let i = 1; i < framesWanted; i++) {
      await waitTicks(api, ticksPerFrame);
      let frame: HTMLCanvasElement | null = null;
      try {
        frame = await rasterizeOnPaint(api, bounds, scale);
      } catch (error) {
        console.warn(`${LOG} paint wait failed on frame ${i + 1}:`, error);
      }
      setSimulationPaused(true);
      if (!frame) {
        console.warn(`${LOG} frame ${i + 1} missing — skipped`);
        continue;
      }
      frames.push(frame);
      if (i === 1 || i % 10 === 0) {
        console.log(`${LOG} captured frame ${i + 1}/${framesWanted}`);
      }
    }

    if (frames.length < 2) return "failed";

    api.ui.toast("Encoding GIF…", {});
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    const bytes = encodeGif(frames, delayMs);
    if (!bytes) return "failed";

    downloadGif(bytes);
    const copied = await copyGifToClipboard(bytes, frames[0]);
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
