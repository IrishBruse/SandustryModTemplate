import { rasterizeOnPaint } from "./captureFrame";
import { MOD_ID } from "./globals";
import { getSelectionCellBounds } from "./selectionBounds";

const LOG = `[${MOD_ID}]`;

/** Same nearest-neighbor scale as the old F8 screenshot. */
const PNG_SCALE = 2;

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

async function copyPngToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  const blob = await canvasToPngBlob(canvas);
  if (!blob) {
    console.error(`${LOG} toBlob returned null`);
    return false;
  }
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    console.error(`${LOG} clipboard image write unavailable`);
    return false;
  }
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": Promise.resolve(blob) })]);
    console.log(`${LOG} copied PNG to clipboard`, { bytes: blob.size });
    return true;
  } catch (error) {
    console.error(`${LOG} clipboard.write failed:`, error);
    return false;
  }
}

export type CapturePngResult = "ok" | "no-selection" | "out-of-view" | "failed";

/** Crop the C marquee after the next paint, then copy a PNG to the clipboard. */
export async function captureSelectionPng(api: SandkitApi): Promise<CapturePngResult> {
  const bounds = getSelectionCellBounds(api);
  if (!bounds) {
    console.warn(`${LOG} no selection bounds`);
    return "no-selection";
  }

  let raster: HTMLCanvasElement | null = null;
  try {
    raster = await rasterizeOnPaint(api, bounds, PNG_SCALE);
  } catch (error) {
    console.warn(`${LOG} PNG paint wait failed:`, error);
    return "failed";
  }
  if (!raster) return "out-of-view";

  const ok = await copyPngToClipboard(raster);
  return ok ? "ok" : "failed";
}
