import { Encoder, type UnencodedFrame } from "modern-gif";
import gifWorkerSource from "modern-gif/worker";
import { applyCaptureLook, getSession, snapshotOnPaint, type CaptureLook } from "./captureFrame";
import { clearMarqueeSelection, getSelectionCellBounds, type CellBounds } from "./selectionBounds";

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
  greenscreen: boolean;
  showMouse: boolean;
};

export type RecordGifResult = "ok" | "no-selection" | "out-of-view" | "failed";

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
    console.warn(`SetPaused worker message failed:`, error);
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
    console.warn(`paint wait failed, retry:`, error);
    setSimulationPaused(false);
    try {
      return await snap();
    } catch (retryError) {
      console.warn(`paint wait failed:`, retryError);
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

function yieldToRenderer(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

let gifWorkerBlobUrl: string | undefined;

function gifEncodeWorkerUrl(): string | undefined {
  if (gifWorkerBlobUrl) return gifWorkerBlobUrl;
  try {
    gifWorkerBlobUrl = URL.createObjectURL(
      new Blob([gifWorkerSource], { type: "text/javascript" }),
    );
    return gifWorkerBlobUrl;
  } catch (error) {
    console.warn(`GIF worker URL failed:`, error);
    return undefined;
  }
}

async function encodeGif(frames: ImageData[], delayMs: number): Promise<Uint8Array | null> {
  if (frames.length === 0) return null;

  const prepared: UnencodedFrame[] = [];
  let width = 0;
  let height = 0;
  for (let i = 0; i < frames.length; i++) {
    const rgba = frameToRgba(frames[i]);
    if (!rgba) return null;
    width = rgba.width;
    height = rgba.height;
    // Scratch canvases reuse the same backing store — copy before the next frame.
    const data = new Uint8ClampedArray(rgba.data) as UnencodedFrame["data"];
    prepared.push({
      data,
      delay: delayMs,
      disposal: 1,
    });
    await yieldToRenderer();
  }
  frames.length = 0;

  const encoder = new Encoder({
    width,
    height,
    maxColors: 255,
    looped: true,
    workerUrl: gifEncodeWorkerUrl(),
  });
  for (const frame of prepared) {
    await encoder.encode(frame);
  }
  const buffer = await encoder.flush();
  return new Uint8Array(buffer);
}

function bytesToGifBlob(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: "image/gif" });
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
 * Pause, capture N frames with `ticksPerFrame` sim ticks between them, encode a GIF, download it.
 */
export async function recordSelectionGif(
  api: SandkitApi,
  options: RecordGifOptions,
): Promise<RecordGifResult> {
  const framesWanted = clampInt(options.frames, MIN_FRAMES, MAX_FRAMES);
  const ticksPerFrame = clampInt(options.ticksPerFrame, MIN_TICKS, MAX_TICKS);
  const delayMs = Math.max(20, ticksPerFrame * 20);
  const look: CaptureLook = {
    greenscreen: options.greenscreen,
    showMouse: options.showMouse,
  };

  const bounds = getSelectionCellBounds(api);
  if (!bounds) {
    console.warn(`no selection bounds`);
    return "no-selection";
  }

  clearMarqueeSelection(api);
  const wasPaused = getSession()?.paused === true;
  console.log(`record start`, {
    bounds,
    framesWanted,
    ticksPerFrame,
    greenscreen: look.greenscreen,
    showMouse: look.showMouse,
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
          console.warn(`frame ${i + 1} missing — abort`);
          return "failed";
        }
        frames.push(frame);
        if (i === 1 || i % 10 === 0) {
          console.log(`captured frame ${i + 1}/${framesWanted}`);
        }
      }
    } finally {
      restoreLook();
      setSimulationPaused(wasPaused);
    }

    if (frames.length < 2) return "failed";

    api.ui.toast("Encoding GIF…", {});
    const bytes = await encodeGif(frames, delayMs);
    if (!bytes) return "failed";

    downloadGif(bytes);
    console.log(`GIF ready`, {
      frames: frames.length,
      bytes: bytes.byteLength,
    });
    return "ok";
  } catch (error) {
    console.error(`record threw:`, error);
    return "failed";
  }
}
