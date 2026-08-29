import { applyCaptureLook, rasterizeOnPaint, type CaptureLook } from "./captureFrame";
import { applyNativeCaptureOverlayToCanvas, nearestNeighborScaleCanvas } from "./overlayApply";
import type { CaptureOverlaySettings } from "./captureSettings";
import { captureDownloadFilename, downloadBlob } from "./downloadAsset";
import { DEFAULT_CAPTURE_SCALE, readCaptureScale } from "./modScale";
import {
  resolveCaptureBounds,
  type CellBounds,
  type SelectionBoundsOptions,
} from "./selectionBounds";

export type CapturePngOptions = SelectionBoundsOptions & {
  /** Locked crop used when the C marquee is off. */
  lockedBounds?: CellBounds | null;
  /** When true, download a PNG file instead of copying to the clipboard. */
  download?: boolean;
  /** Post-capture nearest-neighbor upscale. Default 1. */
  scale?: number;
  /** Optional caption overlay composited after capture. */
  overlay?: CaptureOverlaySettings;
};

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

async function copyPngToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  const blob = await canvasToPngBlob(canvas);
  if (!blob) {
    console.error(`toBlob returned null`);
    return false;
  }
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    console.error(`clipboard image write unavailable`);
    return false;
  }
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": Promise.resolve(blob) })]);
    console.log(`copied PNG to clipboard`, { bytes: blob.size });
    return true;
  } catch (error) {
    console.error(`clipboard.write failed:`, error);
    return false;
  }
}

export type CapturePngResult = "ok" | "no-selection" | "out-of-view" | "failed";

/** Crop the C marquee after the next paint, then copy or download a PNG. */
export async function captureSelectionPng(
  api: SandkitApi,
  look: CaptureLook = { greenscreen: false, showMouse: false },
  options: CapturePngOptions = {},
): Promise<CapturePngResult> {
  const bounds = resolveCaptureBounds(api, options.lockedBounds, options);
  if (!bounds) {
    console.warn(`no selection bounds`);
    return "no-selection";
  }

  const scale = readCaptureScale(options.scale ?? DEFAULT_CAPTURE_SCALE);

  const restoreLook = applyCaptureLook(look);
  let raster: HTMLCanvasElement | null = null;
  try {
    raster = await rasterizeOnPaint(api, bounds, 1, undefined, look);
  } catch (error) {
    console.warn(`PNG paint wait failed:`, error);
    return "failed";
  } finally {
    restoreLook();
  }
  if (!raster) return "out-of-view";

  const copy = document.createElement("canvas");
  copy.width = raster.width;
  copy.height = raster.height;
  const ctx = copy.getContext("2d");
  if (!ctx) return "failed";
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(raster, 0, 0);

  if (options.overlay?.enabled) {
    await applyNativeCaptureOverlayToCanvas(copy, options.overlay);
  }

  const output = nearestNeighborScaleCanvas(copy, scale);

  if (options.download) {
    const blob = await canvasToPngBlob(output);
    if (!blob) return "failed";
    downloadBlob(blob, captureDownloadFilename("png"));
    console.log(`downloaded PNG`, { bytes: blob.size });
    return "ok";
  }

  const ok = await copyPngToClipboard(output);
  return ok ? "ok" : "failed";
}
