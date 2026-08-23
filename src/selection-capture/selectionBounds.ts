/** Inclusive cell rectangle for the active C-cursor marquee selection. */
export type CellBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type CellPoint = { x: number; y: number };

export type SelectedStructure = {
  x: number;
  y: number;
  originalPos?: CellPoint;
};

export type MapPixels = { data: ArrayLike<number>; width: number; height?: number };

export const MIN_BLOCK_PADDING = 0;
export const MAX_BLOCK_PADDING = 32;
export const DEFAULT_BLOCK_PADDING = 1;

/** The dashed C marquee is one cell past the visible content on every side. */
const MARQUEE_CONTENT_INSET_CELLS = 1;

export type SelectionBoundsOptions = {
  /** Extra structure blocks around the core selection. `0` is tight; `1` is the default. */
  blockPadding?: number;
};

export function clampBlockPadding(value: number): number {
  return Math.min(MAX_BLOCK_PADDING, Math.max(MIN_BLOCK_PADDING, Math.round(value)));
}

/** One block-padding step in world cells (one structure footprint width). */
export function blockPaddingToCells(blockPadding: number, snap: number): number {
  const blocks = clampBlockPadding(blockPadding);
  const step = Math.max(1, Math.round(snap));
  return blocks * step;
}

/** Shape of `session.action.customData` while a marquee selection is active. */
type MarqueeCustomData = {
  marqueeSelected?: boolean;
  mode?: number;
  start?: CellPoint;
  end?: CellPoint;
  selectedStructures?: SelectedStructure[];
  mouseOffset?: CellPoint;
};

export function isFinitePoint(point: CellPoint | undefined): point is CellPoint {
  return point !== undefined && Number.isFinite(point.x) && Number.isFinite(point.y);
}

function getMarqueeCustomData(): MarqueeCustomData | null {
  const session = sandkit.state.session as
    | { action?: { customData?: MarqueeCustomData | null } }
    | null
    | undefined;
  const data = session?.action?.customData;
  if (!data || typeof data !== "object") return null;
  return data;
}

type ConstructionSession = {
  construction?: { marqueeActive?: boolean; marqueeToggle?: boolean };
};

/** Drop the C marquee so the player can use other tools while a GIF records. */
export function clearMarqueeSelection(api: SandkitApi): void {
  const data = getMarqueeCustomData();
  api.action.setCustomData({
    ...data,
    marqueeSelected: false,
    mode: 0,
    start: undefined,
    end: undefined,
    selectedStructures: [],
    mouseOffset: undefined,
  });

  const session = sandkit.state.session as ConstructionSession | null | undefined;
  if (session?.construction) {
    session.construction.marqueeActive = false;
    session.construction.marqueeToggle = false;
  }
  api.ui.update(sandkit.enums.ComponentId.ShortcutHelper);
}

export function boundsFromPoints(points: CellPoint[]): CellBounds | null {
  if (points.length === 0) return null;
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Tight AABB around selected structure footprints (snap grid cells).
 * Prefer this over the marquee rect — the dashed box is often one cell past the content
 * on the right and bottom.
 */
export function boundsFromStructures(
  structures: SelectedStructure[],
  snap: number,
): CellBounds | null {
  const points: CellPoint[] = [];
  for (const structure of structures) {
    const origin = structure.originalPos;
    if (!isFinitePoint(origin)) continue;
    points.push(origin);
    points.push({
      x: origin.x + snap - 1,
      y: origin.y + snap - 1,
    });
  }
  return boundsFromPoints(points);
}

/**
 * Marquee `end` is exclusive on the max edges (left/top flush, right/bottom one cell past).
 */
export function unionBounds(a: CellBounds, b: CellBounds): CellBounds {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

export function expandBounds(bounds: CellBounds, margin: number): CellBounds {
  return {
    minX: bounds.minX - margin,
    minY: bounds.minY - margin,
    maxX: bounds.maxX + margin,
    maxY: bounds.maxY + margin,
  };
}

/** Shrink an inclusive cell AABB by `cells` on every side. */
export function insetBounds(bounds: CellBounds, cells: number): CellBounds {
  if (cells <= 0) return bounds;
  const minX = bounds.minX + cells;
  const minY = bounds.minY + cells;
  const maxX = bounds.maxX - cells;
  const maxY = bounds.maxY - cells;
  if (maxX < minX || maxY < minY) return bounds;
  return { minX, minY, maxX, maxY };
}

export function boundsFromMarquee(start: CellPoint, end: CellPoint): CellBounds {
  const rawMinX = Math.min(start.x, end.x);
  const rawMinY = Math.min(start.y, end.y);
  const rawMaxX = Math.max(start.x, end.x);
  const rawMaxY = Math.max(start.y, end.y);
  return {
    minX: rawMinX,
    minY: rawMinY,
    maxX: Math.max(rawMinX, rawMaxX - 1),
    maxY: Math.max(rawMinY, rawMaxY - 1),
  };
}

export function cellIsVisible(r: number, g: number, b: number, a: number): boolean {
  if (a >= 8) return true;
  return r > 8 || g > 8 || b > 8;
}

export function tightenBoundsToMapData(bounds: CellBounds, mapData?: MapPixels | null): CellBounds {
  const map = mapData ?? readSharedMapData();
  if (!map?.data || !map.width) return bounds;

  const mapH = map.height ?? Math.floor(map.data.length / (4 * map.width));
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let cy = bounds.minY; cy <= bounds.maxY; cy++) {
    for (let cx = bounds.minX; cx <= bounds.maxX; cx++) {
      if (cx < 0 || cy < 0 || cx >= map.width || cy >= mapH) continue;
      const i = 4 * (cx + cy * map.width);
      const r = Number(map.data[i] ?? 0);
      const g = Number(map.data[i + 1] ?? 0);
      const b = Number(map.data[i + 2] ?? 0);
      const a = Number(map.data[i + 3] ?? 0);
      if (!cellIsVisible(r, g, b, a)) continue;
      if (cx < minX) minX = cx;
      if (cy < minY) minY = cy;
      if (cx > maxX) maxX = cx;
      if (cy > maxY) maxY = cy;
    }
  }

  if (!Number.isFinite(minX)) return bounds;
  return { minX, minY, maxX, maxY };
}

function readSharedMapData(): MapPixels | null {
  const shared = sandkit.state.shared as { mapData?: MapPixels } | null | undefined;
  return shared?.mapData ?? null;
}

/**
 * Read the active selection cell AABB from engine state.
 * Core bounds come from the marquee and/or structure footprints, then block padding
 * is added on every side. mapData has terrain/structure pixels only — skip tighten
 * when structures are selected so light halos (rendered outside mapData) are kept.
 */
export function getSelectionCellBounds(
  api?: SandkitApi,
  options?: SelectionBoundsOptions,
): CellBounds | null {
  const blockPadding = clampBlockPadding(options?.blockPadding ?? DEFAULT_BLOCK_PADDING);
  const data = getMarqueeCustomData();
  if (!data?.marqueeSelected) return null;

  const snap =
    api?.rendering.getGridMetrics().snapGridCellSize ||
    sandkit.api.rendering.getGridMetrics().snapGridCellSize ||
    4;

  const structureBounds = data.selectedStructures?.length
    ? boundsFromStructures(data.selectedStructures, snap)
    : null;
  const marqueeBounds =
    isFinitePoint(data.start) && isFinitePoint(data.end)
      ? boundsFromMarquee(data.start, data.end)
      : null;

  let core: CellBounds | null = null;
  if (structureBounds) {
    // Structure footprints are symmetric; the dashed marquee is often larger on the right/bottom.
    core = structureBounds;
  } else if (marqueeBounds) {
    core = insetBounds(marqueeBounds, MARQUEE_CONTENT_INSET_CELLS);
  }

  if (!core) return null;
  if (!structureBounds) {
    core = tightenBoundsToMapData(core);
  }
  const paddingCells = blockPaddingToCells(blockPadding, snap);
  if (paddingCells <= 0) return core;
  return expandBounds(core, paddingCells);
}
