import { Encoder, type UnencodedFrame } from "modern-gif";

/** Steam Workshop preview / thumbnail cap (1 MiB). */
export const GIF_1MB = 1024 * 1024;

/** Optional larger GIF size cap (2 MiB). */
export const GIF_2MB = 2 * 1024 * 1024;

/** GIF encode needs at least this many frames. */
export const GIF_MIN_FRAMES = 2;

export function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function yieldToRenderer(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

export async function encodeRgbaFrames(
  prepared: UnencodedFrame[],
  width: number,
  height: number,
  signal: AbortSignal | undefined,
  workerUrl: string | undefined,
): Promise<Uint8Array | null> {
  if (prepared.length === 0) return null;
  throwIfAborted(signal);
  const encoder = new Encoder({
    width,
    height,
    maxColors: 255,
    looped: true,
    workerUrl,
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

export type EncodedGif = { bytes: Uint8Array; frameCount: number; hitLimit: boolean };

/**
 * Encode `prepared` frames. If `maxBytes` is set and the full GIF is over the
 * cap, keep the longest prefix that still fits (at least {@link GIF_MIN_FRAMES}).
 */
export async function encodePreparedGifWithLimit(
  prepared: UnencodedFrame[],
  width: number,
  height: number,
  maxBytes: number | undefined,
  signal: AbortSignal | undefined,
  workerUrl: string | undefined,
): Promise<EncodedGif | "too-large" | null> {
  if (prepared.length === 0) return null;

  const full = await encodeRgbaFrames(prepared, width, height, signal, workerUrl);
  if (!full) return null;
  if (maxBytes === undefined || full.byteLength <= maxBytes) {
    return { bytes: full, frameCount: prepared.length, hitLimit: false };
  }

  let lo = GIF_MIN_FRAMES;
  let hi = prepared.length - 1;
  let best: Uint8Array | null = null;
  let bestCount = 0;
  while (lo <= hi) {
    throwIfAborted(signal);
    const mid = (lo + hi) >> 1;
    const attempt = await encodeRgbaFrames(
      prepared.slice(0, mid),
      width,
      height,
      signal,
      workerUrl,
    );
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
