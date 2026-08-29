/** Mod load report from `session.externalMods` (same source as the loader). */

import {
  discoveredViaFromRecord,
  modSourceKind,
  rootUrlFromRecord,
  workshopFolderFromRecord,
  workshopItemIdFromRecord,
  type ModSourceKind,
} from "./mod-source";

export type ModLoadStatus = "loaded" | "failed" | "blocked" | "unknown" | string;

export type ModRegistryCount = {
  bag: string;
  count: number;
  sample: string[];
};

export type ModReportEntry = {
  order: number;
  id: string;
  name: string;
  version: string;
  author: string | null;
  description: string;
  status: ModLoadStatus;
  error: string | null;
  dependencies: string[];
  hasSettings: boolean;
  itemId: string | null;
  source: string | null;
  discoveredVia: string[];
  sourceKind: ModSourceKind;
  folder: string | null;
  rootUrl: string | null;
  apiVersion: number | null;
  manifestVersion: number | null;
  loadOrder: number | null;
  entry: string | null;
  hasWorker: boolean;
  hasEntrySource: boolean;
  registry: ModRegistryCount[];
};

export type ModDiagnostic = {
  code: string;
  modId: string | null;
  message: string;
};

export type ModReport = {
  mods: ModReportEntry[];
  diagnostics: ModDiagnostic[];
  missing: string[];
  loadedCount: number;
  problemCount: number;
};

type ExternalModsSession = {
  orderedMods?: unknown;
  statuses?: unknown;
  diagnostics?: unknown;
  missingSavedMods?: unknown;
};

function stringField(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function workshopSource(entry: Record<string, unknown>): {
  source: string | null;
  itemId: string | null;
} {
  const itemId = workshopItemIdFromRecord(entry);
  if (itemId) return { source: `workshop ${itemId}`, itemId };
  const via = discoveredViaFromRecord(entry);
  return { source: via.length > 0 ? via.join(", ") : null, itemId: null };
}

function numberField(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function hasPayload(value: unknown): boolean {
  if (typeof value === "string") return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return false;
}

function ownedRegistryCounts(modIds: readonly string[]): Map<string, ModRegistryCount[]> {
  const out = new Map<string, ModRegistryCount[]>();
  for (const modId of modIds) out.set(modId, []);
  try {
    const bags = (
      sandkit.engine?.state as { sandkit?: { mods?: Record<string, unknown> } } | undefined
    )?.sandkit?.mods;
    if (!bags || typeof bags !== "object") return out;

    for (const [bag, value] of Object.entries(bags)) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const byMod = new Map<string, string[]>();
      for (const id of Object.keys(value as object)) {
        for (const modId of modIds) {
          const prefix = `${modId}:`;
          if (id !== modId && !id.startsWith(prefix)) continue;
          let ids = byMod.get(modId);
          if (!ids) {
            ids = [];
            byMod.set(modId, ids);
          }
          ids.push(id);
        }
      }
      for (const [modId, ids] of byMod) {
        if (ids.length === 0) continue;
        out.get(modId)!.push({ bag, count: ids.length, sample: ids.slice(0, 12) });
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

function parseDiagnostic(entry: unknown): ModDiagnostic | null {
  if (!entry || typeof entry !== "object") return null;
  const row = entry as Record<string, unknown>;
  return {
    code: stringField(row.code, "?"),
    modId: stringField(row.modId) || null,
    message: stringField(row.message),
  };
}

/** Full mod report for the Dev Tools Mods tab. */
export function readModReport(): ModReport | null {
  return buildModReport();
}

let reportCache: { at: number; value: ModReport | null } | null = null;
const REPORT_CACHE_MS = 1500;

function buildModReport(): ModReport | null {
  const now = Date.now();
  if (reportCache && now - reportCache.at < REPORT_CACHE_MS) return reportCache.value;
  const value = buildModReportUncached();
  reportCache = { at: now, value };
  return value;
}

function buildModReportUncached(): ModReport | null {
  try {
    const external = (
      sandkit.engine?.state as { session?: { externalMods?: ExternalModsSession } } | undefined
    )?.session?.externalMods;
    if (!external) return null;

    const ordered = Array.isArray(external.orderedMods) ? external.orderedMods : [];
    const statuses = Array.isArray(external.statuses) ? external.statuses : [];
    const diagnosticsRaw = Array.isArray(external.diagnostics) ? external.diagnostics : [];
    const missingRaw = Array.isArray(external.missingSavedMods) ? external.missingSavedMods : [];

    const statusById = new Map<string, { status?: string; error?: string }>();
    for (const entry of statuses) {
      if (!entry || typeof entry !== "object") continue;
      const id = stringField((entry as { id?: unknown }).id);
      if (id) statusById.set(id, entry as { status?: string; error?: string });
    }

    const mods: ModReportEntry[] = [];
    const modIds: string[] = [];
    const rows: Array<{ index: number; row: Record<string, unknown>; id: string }> = [];
    for (let index = 0; index < ordered.length; index++) {
      const record = ordered[index];
      if (!record || typeof record !== "object") continue;
      const row = record as Record<string, unknown>;
      const manifest =
        row.manifest && typeof row.manifest === "object"
          ? (row.manifest as Record<string, unknown>)
          : {};
      const id = stringField(manifest.id) || stringField(row.id) || "?";
      modIds.push(id);
      rows.push({ index, row, id });
    }

    const registryByMod = ownedRegistryCounts(modIds);

    for (const { index, row, id } of rows) {
      const manifest =
        row.manifest && typeof row.manifest === "object"
          ? (row.manifest as Record<string, unknown>)
          : {};
      const statusEntry = statusById.get(id);
      const { source, itemId } = workshopSource(row);
      const discoveredVia = discoveredViaFromRecord(row);
      const sourceKind = modSourceKind(discoveredVia, itemId);

      const configSchema = manifest.configSchema;
      const hasSettings =
        !!configSchema &&
        typeof configSchema === "object" &&
        Object.keys(configSchema as object).length > 0;

      mods.push({
        order: index,
        id,
        name: stringField(manifest.name, id),
        version: stringField(manifest.version, "—"),
        author: stringField(manifest.author) || null,
        description: stringField(manifest.description),
        status: stringField(statusEntry?.status, "unknown"),
        error: stringField(statusEntry?.error) || null,
        dependencies: Array.isArray(manifest.dependencies)
          ? manifest.dependencies.filter((dep): dep is string => typeof dep === "string")
          : [],
        hasSettings,
        itemId,
        source,
        discoveredVia: [...discoveredVia],
        sourceKind,
        folder: workshopFolderFromRecord(row),
        rootUrl: rootUrlFromRecord(row),
        apiVersion: numberField(manifest.apiVersion),
        manifestVersion: numberField(manifest.manifestVersion),
        loadOrder: numberField(manifest.loadOrder),
        entry: stringField(manifest.entry) || null,
        hasWorker: hasPayload(row.workerSource),
        hasEntrySource: hasPayload(row.entrySource),
        registry: registryByMod.get(id) ?? [],
      });
    }

    const missing = missingRaw.filter((id): id is string => typeof id === "string");
    const missingSet = new Set(missing);

    const diagnostics = diagnosticsRaw
      .map(parseDiagnostic)
      .filter((entry): entry is ModDiagnostic => entry !== null)
      .filter(
        (entry) =>
          entry.code !== "missing_saved_mod" &&
          !(entry.modId !== null && missingSet.has(entry.modId)),
      );

    const loadedCount = mods.filter((mod) => mod.status === "loaded").length;
    const problemCount =
      mods.filter((mod) => mod.status === "failed" || mod.status === "blocked").length +
      missing.length;

    return { mods, diagnostics, missing, loadedCount, problemCount };
  } catch {
    return null;
  }
}
