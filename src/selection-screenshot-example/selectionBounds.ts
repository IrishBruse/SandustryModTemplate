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
  return (
    point !== undefined &&
    Number.isFinite(point.x) &&
    Number.isFinite(point.y)
  );
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

/** Debug snapshot of marquee state (safe to log). */
export function peekMarqueeCustomData(): {
  hasSession: boolean;
  hasCustomData: boolean;
  marqueeSelected: boolean | undefined;
  start: CellPoint | undefined;
  end: CellPoint | undefined;
  structureCount: number;
  mode: unknown;
} {
  const session = sandkit.state.session as
    | { action?: { customData?: (MarqueeCustomData & { mode?: unknown }) | null } }
    | null
    | undefined;
  const data = session?.action?.customData;
  return {
    hasSession: session != null,
    hasCustomData: data != null && typeof data === "object",
    marqueeSelected: data?.marqueeSelected,
    start: data?.start,
    end: data?.end,
    structureCount: data?.selectedStructures?.length ?? 0,
    mode: data?.mode,
  };
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
 * Read the active marquee selection cell AABB from engine state.
 * Prefer `start`/`end`; fall back to `selectedStructures` world positions.
 */
export function getSelectionCellBounds(): CellBounds | null {
  const data = getMarqueeCustomData();
  if (!data?.marqueeSelected) return null;

  if (isFinitePoint(data.start) && isFinitePoint(data.end)) {
    return {
      minX: Math.min(data.start.x, data.end.x),
      minY: Math.min(data.start.y, data.end.y),
      maxX: Math.max(data.start.x, data.end.x),
      maxY: Math.max(data.start.y, data.end.y),
    };
  }

  const structures = data.selectedStructures;
  if (!structures?.length) return null;

  const points: CellPoint[] = [];
  for (const structure of structures) {
    if (isFinitePoint(structure.originalPos)) {
      points.push(structure.originalPos);
    } else if (Number.isFinite(structure.x) && Number.isFinite(structure.y)) {
      points.push({ x: structure.x, y: structure.y });
    }
  }
  return boundsFromPoints(points);
}
