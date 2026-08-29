import type { UnencodedFrame } from "modern-gif";
import gifWorkerSource from "modern-gif/worker";
import {
  GIF_MIN_FRAMES,
  encodePreparedGifWithLimit,
  isAbortError,
  throwIfAborted,
} from "./encodeGifLimit";
import { applyCaptureLook, getSession, snapshotOnPaint, type CaptureLook } from "./captureFrame";
import type { CaptureOverlaySettings } from "./captureSettings";
import { applyNativeCaptureOverlay } from "./overlayApply";
import { gifSizeLimitBytes, type GifSizeLimit } from "./captureSettings";
import { DEFAULT_CAPTURE_SCALE, readCaptureScale } from "./modScale";
import { clearMarqueeSelection, type CellBounds } from "./selectionBounds";
import { captureDownloadFilename, downloadBlob, gifBytesToBlob } from "./downloadAsset";

const MIN_FRAMES = GIF_MIN_FRAMES;
const MIN_TICKS = 1;
const MAX_TICKS = 30;

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
  /** Cap encoded GIF size (`none` keeps the full file). */
  gifSizeLimit: GifSizeLimit;
  /** Extra structure blocks around the core selection. `0` is tight; `1` is the default. */
  blockPadding?: number;
  /** When set, record this crop instead of reading the C marquee. */
  bounds?: CellBounds;
  /** Post-capture nearest-neighbor upscale. Default 1. */
  scale?: number;
  signal?: AbortSignal;
  /** Called after capture, before encode. */
  onEncodeStart?: () => void;
  /** Optional caption overlay composited on each frame after upscale. */
  overlay?: CaptureOverlaySettings;
};

export type RecordGifResult =
  | "ok"
  | "ok-capped"
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

function clampMinInt(value: number, min: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.round(value));
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
  scale: number,
): { data: Uint8ClampedArray; width: number; height: number } | null {
  const src = gifScratch("src", frame.width, frame.height);
  const srcCtx = src.getContext("2d", { willReadFrequently: true });
  if (!srcCtx) return null;
  srcCtx.putImageData(frame, 0, 0);

  const pixelScale = readCaptureScale(scale);
  const scaled = gifScratch("scaled", frame.width * pixelScale, frame.height * pixelScale);
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

async function encodeGif(
  frames: ImageData[],
  delayMs: number,
  maxBytes: number | undefined,
  signal: AbortSignal | undefined,
  scale: number,
) {
  if (frames.length === 0) return null;

  const prepared: UnencodedFrame[] = [];
  let width = 0;
  let height = 0;
  for (let i = 0; i < frames.length; i++) {
    throwIfAborted(signal);
    const rgba = frameToRgba(frames[i], scale);
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

  return encodePreparedGifWithLimit(
    prepared,
    width,
    height,
    maxBytes,
    signal,
    gifEncodeWorkerUrl(),
  );
}

/**
 * Pause, capture N frames with `ticksPerFrame` sim ticks between them, encode a GIF, and download it.
 */
export async function recordSelectionGif(
  api: SandkitApi,
  options: RecordGifOptions,
): Promise<RecordGifResult> {
  const framesWanted = clampMinInt(options.frames, MIN_FRAMES);
  const ticksPerFrame = clampInt(options.ticksPerFrame, MIN_TICKS, MAX_TICKS);
  const delayMs = Math.max(20, ticksPerFrame * 20);
  const look: CaptureLook = {
    greenscreen: options.greenscreen,
    showMouse: options.showMouse,
  };

  const bounds = options.bounds;
  if (!bounds) {
    console.warn(`no GIF bounds`);
    return "no-selection";
  }

  clearMarqueeSelection(api);
  const wasPaused = getSession()?.paused === true;
  const maxBytes = gifSizeLimitBytes(options.gifSizeLimit);
  const scale = readCaptureScale(options.scale ?? DEFAULT_CAPTURE_SCALE);
  console.log(`record start`, {
    bounds,
    framesWanted,
    ticksPerFrame,
    scale,
    greenscreen: look.greenscreen,
    showMouse: look.showMouse,
    gifSizeLimit: options.gifSizeLimit,
  });

  const overlay = options.overlay;
  const frames: ImageData[] = [];
  const restoreLook = applyCaptureLook(look);
  try {
    try {
      const first = await captureGifFrame(api, bounds, look);
      throwIfAborted(options.signal);
      if (!first) return "out-of-view";
      frames.push(overlay?.enabled ? await applyNativeCaptureOverlay(first, overlay) : first);

      for (let i = 1; i < framesWanted; i++) {
        await waitTicks(api, ticksPerFrame, options.signal);
        throwIfAborted(options.signal);
        const frame = await captureGifFrame(api, bounds, look);
        throwIfAborted(options.signal);
        if (!frame) {
          console.warn(`frame ${i + 1} missing — abort`);
          return "failed";
        }
        frames.push(overlay?.enabled ? await applyNativeCaptureOverlay(frame, overlay) : frame);
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
    const encoded = await encodeGif(frames, delayMs, maxBytes, options.signal, scale);
    if (encoded === "too-large") return "too-large";
    if (!encoded) return "failed";

    downloadBlob(gifBytesToBlob(encoded.bytes), captureDownloadFilename("gif"));
    console.log(`GIF ready`, {
      frames: encoded.frameCount,
      bytes: encoded.bytes.byteLength,
      hitLimit: encoded.hitLimit,
    });
    return encoded.hitLimit ? "ok-capped" : "ok";
  } catch (error) {
    if (isAbortError(error)) return "cancelled";
    console.error(`record threw:`, error);
    return "failed";
  }
}
