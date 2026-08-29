import {
  expandScreenRectOutlineOutward,
  getSelectionScreenRect,
  type ScreenRect,
} from "./captureFrame";
import {
  hideAdvancedOverlayDomPreview,
  syncAdvancedOverlayDomPreview,
} from "./advancedOverlayDomPreview";
import { drawSimpleOverlayInScreenRect } from "./captureOverlay";
import type { CaptureOverlaySettings } from "./captureSettings";
import {
  cellBoundsEqual,
  getSelectionCellBounds,
  type CellBounds,
  type SelectionBoundsOptions,
} from "./selectionBounds";

const PREVIEW_OUTLINE_IDLE = "rgba(255, 165, 0, 0.85)";
const PREVIEW_OUTLINE_RECORDING = "rgba(255, 0, 0, 0.75)";
const PREVIEW_OUTLINE_ENCODING = "rgba(0, 120, 255, 0.75)";

const PREVIEW_OUTLINE_WIDTH = 3;

export type CapturePreviewOutline = "idle" | "recording" | "encoding";

export type CapturePreviewState = SelectionBoundsOptions & {
  outline?: CapturePreviewOutline;
  /** Crop held while a GIF records (C select mode exits at record start). */
  frozenBounds?: CellBounds | null;
  /** Locked GIF crop shown when idle. */
  lockedGifBounds?: CellBounds | null;
  overlay?: CaptureOverlaySettings;
};

function strokePreviewRect(
  ctx: CanvasRenderingContext2D,
  rect: ScreenRect,
  color: string,
  lineWidth: number,
): void {
  const outline = expandScreenRectOutlineOutward(rect, lineWidth);
  const { x, y, width, height } = outline;
  if (width <= 0 || height <= 0) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();
}

function strokeBounds(
  ctx: CanvasRenderingContext2D,
  api: SandkitApi,
  bounds: CellBounds,
  color: string,
  lineWidth: number,
): void {
  const rect = getSelectionScreenRect(api, bounds);
  if (!rect) return;
  strokePreviewRect(ctx, rect, color, lineWidth);
}

/** Draw crop outlines: locked GIF area, live C selection, and active recording crop. */
export function installCaptureAreaPreview(readState: () => CapturePreviewState): () => void {
  const api = sandkit.api;
  const unsubscribe = api.events.on("frame:render", () => {
    const state = readState();
    const outline = state.outline ?? "idle";
    const gifBounds = state.frozenBounds ?? state.lockedGifBounds ?? null;
    const liveBounds = getSelectionCellBounds(api, state);
    const previewBounds = gifBounds ?? liveBounds;
    const overlay = state.overlay;
    const previewRect =
      previewBounds && overlay?.enabled ? getSelectionScreenRect(api, previewBounds) : null;

    if (previewRect && overlay?.enabled && overlay.advanced) {
      syncAdvancedOverlayDomPreview(overlay, previewRect);
    } else {
      hideAdvancedOverlayDomPreview();
    }

    api.rendering.withOverlayContext((ctx) => {
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = PREVIEW_OUTLINE_WIDTH;

      if (gifBounds) {
        const color =
          state.frozenBounds && outline === "recording"
            ? PREVIEW_OUTLINE_RECORDING
            : state.frozenBounds && outline === "encoding"
              ? PREVIEW_OUTLINE_ENCODING
              : PREVIEW_OUTLINE_IDLE;
        strokeBounds(ctx, api, gifBounds, color, PREVIEW_OUTLINE_WIDTH);
      }

      if (liveBounds && (!gifBounds || !cellBoundsEqual(liveBounds, gifBounds))) {
        strokeBounds(ctx, api, liveBounds, PREVIEW_OUTLINE_IDLE, PREVIEW_OUTLINE_WIDTH);
      }

      if (previewRect && overlay?.enabled && !overlay.advanced) {
        drawSimpleOverlayInScreenRect(ctx, overlay, previewRect);
      }

      ctx.restore();
    });
  });

  return () => {
    unsubscribe();
    hideAdvancedOverlayDomPreview();
  };
}
