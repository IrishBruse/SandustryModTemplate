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
/** Steam Workshop preview / thumbnail cap (1 MiB). */
const GIF_1MB = 1024 * 1024;

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
  /** Stop the file at 1 MiB (Steam Workshop thumbnails). */
  limit1Mb: boolean;
  signal?: AbortSignal;
  /** Called after capture, before encode. */
  onEncodeStart?: () => void;
};

export type RecordGifResult =
  | "ok"
  | "ok-1mb"
  | "too-large"
  | "cancelled"
  | "no-selection"
  | "out-of-view"
  | "failed";

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

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function waitTicks(api: SandkitApi, count: number, signal: AbortSignal | undefined): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    let left = count;
    const timeoutId = setTimeout(() => {
      setSimulationPaused(true);
      reject(new Error("tick wait timed out"));
    }, 15_000);

    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });

    const step = () => {
      if (signal?.aborted) return;
      left -= 1;
      if (left <= 0) {
        clearTimeout(timeoutId);
        signal?.removeEventListener("abort", onAbort);
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

async function encodeRgbaFrames(
  prepared: UnencodedFrame[],
  width: number,
  height: number,
  signal: AbortSignal | undefined,
): Promise<Uint8Array | null> {
  if (prepared.length === 0) return null;
  throwIfAborted(signal);
  const encoder = new Encoder({
    width,
    height,
    maxColors: 255,
    looped: true,
    workerUrl: gifEncodeWorkerUrl(),
  });
  for (const frame of prepared) {
    throwIfAborted(signal);
    const src = frame.data;
    if (!(src instanceof Uint8ClampedArray)) return null;
    // Worker encode transfers the buffer — copy so we can trim and encode again.
    const data = new Uint8ClampedArray(src.length);
    data.set(src);
    await encoder.encode({
      data,
      delay: frame.delay,
      disposal: frame.disposal,
    });
  }
  throwIfAborted(signal);
  const buffer = await encoder.flush();
  throwIfAborted(signal);
  return new Uint8Array(buffer);
}

type EncodedGif = { bytes: Uint8Array; frameCount: number; hitLimit: boolean };

async function encodeGif(
  frames: ImageData[],
  delayMs: number,
  maxBytes: number | undefined,
  signal: AbortSignal | undefined,
): Promise<EncodedGif | "too-large" | null> {
  if (frames.length === 0) return null;

  const prepared: UnencodedFrame[] = [];
  let width = 0;
  let height = 0;
  for (let i = 0; i < frames.length; i++) {
    throwIfAborted(signal);
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

  const full = await encodeRgbaFrames(prepared, width, height, signal);
  if (!full) return null;
  if (maxBytes === undefined || full.byteLength <= maxBytes) {
    return { bytes: full, frameCount: prepared.length, hitLimit: false };
  }

  let lo = MIN_FRAMES;
  let hi = prepared.length - 1;
  let best: Uint8Array | null = null;
  let bestCount = 0;
  while (lo <= hi) {
    throwIfAborted(signal);
    const mid = (lo + hi) >> 1;
    const attempt = await encodeRgbaFrames(prepared.slice(0, mid), width, height, signal);
    await yieldToRenderer();
    if (attempt && attempt.byteLength <= maxBytes) {
      best = attempt;
      bestCount = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  if (!best) return "too-large";
  return { bytes: best, frameCount: bestCount, hitLimit: true };
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
  const maxBytes = options.limit1Mb ? GIF_1MB : undefined;
  console.log(`record start`, {
    bounds,
    framesWanted,
    ticksPerFrame,
    greenscreen: look.greenscreen,
    showMouse: look.showMouse,
    limit1Mb: options.limit1Mb,
  });

  const frames: ImageData[] = [];
  const restoreLook = applyCaptureLook(look);
  try {
    try {
      const first = await captureGifFrame(api, bounds, look);
      throwIfAborted(options.signal);
      if (!first) return "out-of-view";
      frames.push(first);

      for (let i = 1; i < framesWanted; i++) {
        await waitTicks(api, ticksPerFrame, options.signal);
        throwIfAborted(options.signal);
        const frame = await captureGifFrame(api, bounds, look);
        throwIfAborted(options.signal);
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

    options.onEncodeStart?.();
    api.ui.toast("Encoding GIF…", {});
    const encoded = await encodeGif(frames, delayMs, maxBytes, options.signal);
    if (encoded === "too-large") return "too-large";
    if (!encoded) return "failed";

    downloadGif(encoded.bytes);
    console.log(`GIF ready`, {
      frames: encoded.frameCount,
      bytes: encoded.bytes.byteLength,
      hitLimit: encoded.hitLimit,
    });
    return encoded.hitLimit ? "ok-1mb" : "ok";
  } catch (error) {
    if (isAbortError(error)) return "cancelled";
    console.error(`record threw:`, error);
    return "failed";
  }
}
