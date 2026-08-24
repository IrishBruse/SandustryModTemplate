import { applyCaptureLook, rasterizeOnPaint, type CaptureLook } from "./captureFrame";
import { getSelectionCellBounds, type SelectionBoundsOptions } from "./selectionBounds";

/** Same nearest-neighbor scale as the PNG screenshot. */
const PNG_SCALE = 2;

export type CapturePngOptions = SelectionBoundsOptions;

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

/** Crop the C marquee after the next paint, then copy a PNG to the clipboard. */
export async function captureSelectionPng(
  api: SandkitApi,
  look: CaptureLook = { greenscreen: false, showMouse: false },
  options: CapturePngOptions = {},
): Promise<CapturePngResult> {
  const bounds = getSelectionCellBounds(api, options);
  if (!bounds) {
    console.warn(`no selection bounds`);
    return "no-selection";
  }

  const restoreLook = applyCaptureLook(look);
  let raster: HTMLCanvasElement | null = null;
  try {
    raster = await rasterizeOnPaint(api, bounds, PNG_SCALE, undefined, look);
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

  const ok = await copyPngToClipboard(copy);
  return ok ? "ok" : "failed";
}
