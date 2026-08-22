import { GIFEncoder, applyPalette, quantize } from "gifenc";
import { getSession, rasterizeSelection, waitForPaint } from "./captureFrame";
import { MOD_ID } from "./globals";
import { getSelectionCellBounds } from "./selectionBounds";

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
        setSimulationPaused(true);
        resolve();
        return;
      }
      api.schedule.nextTick(step);
    };

    api.schedule.nextTick(step);
    setSimulationPaused(false);
  });
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

function encodeGif(frames: HTMLCanvasElement[], delayMs: number): Uint8Array | null {
  if (frames.length === 0) return null;
  const gif = GIFEncoder();
  for (let i = 0; i < frames.length; i++) {
    const rgba = canvasToRgba(frames[i]);
    if (!rgba) return null;
    const palette = quantize(rgba.data, 256);
    const index = applyPalette(rgba.data, palette);
    gif.writeFrame(index, rgba.width, rgba.height, {
      palette,
      delay: delayMs,
      repeat: i === 0 ? 0 : undefined,
    });
  }
  gif.finish();
  return gif.bytes();
}

function downloadBytes(bytes: Uint8Array, filename: string): void {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type: "image/gif" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function gifFilename(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `sandustry-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.gif`;
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
  const scale = clampScale(options.scale);
  const delayMs = Math.max(20, ticksPerFrame * 20);

  const bounds = getSelectionCellBounds(api);
  if (!bounds) {
    console.warn(`${LOG} no selection bounds`);
    return "no-selection";
  }

  const wasPaused = getSession()?.paused === true;
  console.log(`${LOG} record start`, {
    bounds,
    framesWanted,
    ticksPerFrame,
    scale,
  });

  const frames: HTMLCanvasElement[] = [];
  try {
    setSimulationPaused(true);
    await waitForPaint(api);

    const first = rasterizeSelection(api, bounds, scale);
    if (!first) return "out-of-view";
    frames.push(first);

    for (let i = 1; i < framesWanted; i++) {
      await waitTicks(api, ticksPerFrame);
      await waitForPaint(api);
      const frame = rasterizeSelection(api, bounds, scale);
      if (!frame) {
        console.warn(`${LOG} frame ${i + 1} blank — stopping`);
        break;
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

    const filename = gifFilename();
    downloadBytes(bytes, filename);
    console.log(`${LOG} GIF ready`, {
      frames: frames.length,
      bytes: bytes.byteLength,
      filename,
    });
    return "ok";
  } catch (error) {
    console.error(`${LOG} record threw:`, error);
    return "failed";
  } finally {
    setSimulationPaused(wasPaused);
  }
}
