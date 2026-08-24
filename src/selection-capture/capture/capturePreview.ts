import { getSelectionScreenRect, type ScreenRect } from "./captureFrame";
import {
  getSelectionCellBounds,
  type CellBounds,
  type SelectionBoundsOptions,
} from "./selectionBounds";

const PREVIEW_OUTLINE_IDLE = "rgba(0, 120, 255, 0.75)";
const PREVIEW_OUTLINE_RECORDING = "rgba(255, 0, 0, 0.75)";

export type CapturePreviewState = SelectionBoundsOptions & {
  recording?: boolean;
  /** Crop held while a GIF records (the C marquee is cleared at record start). */
  frozenBounds?: CellBounds | null;
};

function strokePreviewRect(ctx: CanvasRenderingContext2D, rect: ScreenRect): void {
  const { x, y, width, height } = rect;
  if (width <= 0 || height <= 0) return;
  ctx.beginPath();
  ctx.moveTo(x + 0.5, y + 0.5);
  ctx.lineTo(x + width - 0.5, y + 0.5);
  ctx.lineTo(x + width - 0.5, y + height - 0.5);
  ctx.lineTo(x + 0.5, y + height - 0.5);
  ctx.closePath();
  ctx.stroke();
}

/** Draw a solid outline of the PNG/GIF crop while the panel is open or a GIF records. */
export function installCaptureAreaPreview(readState: () => CapturePreviewState): () => void {
  const api = sandkit.api;
  return api.events.on("frame:render", () => {
    const state = readState();
    const bounds = state.frozenBounds ?? getSelectionCellBounds(api, state);
    if (!bounds) return;
    const rect = getSelectionScreenRect(api, bounds);
    if (!rect) return;

    api.rendering.withOverlayContext((ctx) => {
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = state.recording ? PREVIEW_OUTLINE_RECORDING : PREVIEW_OUTLINE_IDLE;
      strokePreviewRect(ctx, rect);
      ctx.restore();
    });
  });
}
