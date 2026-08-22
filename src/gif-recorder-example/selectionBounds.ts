/** Inclusive cell rectangle for the active C-cursor marquee selection. */
export type CellBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

type CellPoint = { x: number; y: number };

type SelectedStructure = {
  x: number;
  y: number;
  originalPos?: CellPoint;
};

/** Shape of `session.action.customData` while a marquee selection is active. */
type MarqueeCustomData = {
  marqueeSelected?: boolean;
  start?: CellPoint;
  end?: CellPoint;
  selectedStructures?: SelectedStructure[];
};

function isFinitePoint(point: CellPoint | undefined): point is CellPoint {
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

function boundsFromPoints(points: CellPoint[]): CellBounds | null {
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
function boundsFromStructures(structures: SelectedStructure[], snap: number): CellBounds | null {
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
function boundsFromMarquee(start: CellPoint, end: CellPoint): CellBounds {
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

function cellIsVisible(r: number, g: number, b: number, a: number): boolean {
  if (a >= 8) return true;
  return r > 8 || g > 8 || b > 8;
}

function tightenBoundsToMapData(bounds: CellBounds): CellBounds {
  const shared = sandkit.state.shared as
    | { mapData?: { data: ArrayLike<number>; width: number; height?: number } }
    | null
    | undefined;
  const mapData = shared?.mapData;
  if (!mapData?.data || !mapData.width) return bounds;

  const mapH = mapData.height ?? Math.floor(mapData.data.length / (4 * mapData.width));
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let cy = bounds.minY; cy <= bounds.maxY; cy++) {
    for (let cx = bounds.minX; cx <= bounds.maxX; cx++) {
      if (cx < 0 || cy < 0 || cx >= mapData.width || cy >= mapH) continue;
      const i = 4 * (cx + cy * mapData.width);
      const r = Number(mapData.data[i] ?? 0);
      const g = Number(mapData.data[i + 1] ?? 0);
      const b = Number(mapData.data[i + 2] ?? 0);
      const a = Number(mapData.data[i + 3] ?? 0);
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

/**
 * Read the active selection cell AABB from engine state.
 * Prefer structure footprints; fall back to marquee start/end (exclusive max).
 */
export function getSelectionCellBounds(api?: SandkitApi): CellBounds | null {
  const data = getMarqueeCustomData();
  if (!data?.marqueeSelected) return null;

  const snap =
    api?.rendering.getGridMetrics().snapGridCellSize ||
    sandkit.api.rendering.getGridMetrics().snapGridCellSize ||
    4;

  let bounds: CellBounds | null = null;

  if (data.selectedStructures?.length) {
    bounds = boundsFromStructures(data.selectedStructures, snap);
  }

  if (!bounds && isFinitePoint(data.start) && isFinitePoint(data.end)) {
    bounds = boundsFromMarquee(data.start, data.end);
  }

  if (!bounds) return null;
  return tightenBoundsToMapData(bounds);
}
