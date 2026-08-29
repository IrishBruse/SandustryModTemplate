/** Type id drift detection (from uolkx mod-inspector). */

const MOD_ID = "dev-tools";
const TYPE_MAP_KEY = "typeMap";

export type TypeDriftEntry = {
  kind: "elements" | "matters";
  id: string;
  was: number;
  now: number | null;
};

export type TypeDriftState = {
  drift: TypeDriftEntry[];
  firstRun: boolean;
};

type TypeMap = {
  elements: Record<string, number>;
  matters: Record<string, number>;
};

function readRegistry(
  registry: Record<string, Record<string, unknown>> | undefined,
  field: "elementType" | "matterType",
): Record<string, number> {
  const out: Record<string, number> = {};
  if (!registry) return out;
  for (const [id, definition] of Object.entries(registry)) {
    const value = definition?.[field];
    if (typeof value === "number") out[id] = value;
  }
  return out;
}

function currentTypeMap(): TypeMap | null {
  try {
    const mods = (
      sandkit.engine?.state as {
        sandkit?: {
          mods?: { elements?: Record<string, unknown>; matters?: Record<string, unknown> };
        };
      }
    )?.sandkit?.mods;
    if (!mods) return null;
    return {
      elements: readRegistry(
        mods.elements as Record<string, Record<string, unknown>>,
        "elementType",
      ),
      matters: readRegistry(mods.matters as Record<string, Record<string, unknown>>, "matterType"),
    };
  } catch {
    return null;
  }
}

function savedTypeMap(): TypeMap | null {
  try {
    const saved = sandkit.api.storage.get(MOD_ID, TYPE_MAP_KEY);
    if (!saved || typeof saved !== "object") return null;
    const row = saved as { elements?: unknown; matters?: unknown };
    return {
      elements:
        row.elements && typeof row.elements === "object"
          ? (row.elements as Record<string, number>)
          : {},
      matters:
        row.matters && typeof row.matters === "object"
          ? (row.matters as Record<string, number>)
          : {},
    };
  } catch {
    return null;
  }
}

function compareTypeMaps(current: TypeMap, saved: TypeMap): TypeDriftEntry[] {
  const drift: TypeDriftEntry[] = [];
  for (const kind of ["elements", "matters"] as const) {
    for (const [id, was] of Object.entries(saved[kind])) {
      const now = current[kind][id];
      if (now === undefined) drift.push({ kind, id, was, now: null });
      else if (now !== was) drift.push({ kind, id, was, now });
    }
  }
  return drift;
}

/** Refresh drift snapshot. Never overwrite while drift is present. */
export function refreshTypeDrift(): TypeDriftState {
  const current = currentTypeMap();
  if (!current) return { drift: [], firstRun: false };

  const saved = savedTypeMap();
  const drift = saved ? compareTypeMaps(current, saved) : [];

  if (drift.length === 0) {
    try {
      sandkit.api.storage.set(MOD_ID, TYPE_MAP_KEY, current);
    } catch {
      /* ignore */
    }
  }

  return { drift, firstRun: !saved };
}

export function driftReportLines(drift: TypeDriftEntry[]): string[] {
  return drift.map(
    (entry) =>
      `${entry.kind}/${entry.id}: was ${entry.was} → ${entry.now === null ? "missing" : entry.now}`,
  );
}
