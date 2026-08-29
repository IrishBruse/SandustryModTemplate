/** Mod load report from `session.externalMods` (same source as the loader). */

import {
  discoveredViaFromRecord,
  modSourceKind,
  workshopFolderFromRecord,
  workshopItemIdFromRecord,
  type ModSourceKind
} from "./mod-source";

export type ModLoadStatus =
  | "loaded"
  | "failed"
  | "blocked"
  | "unknown"
  | string;

export type ModRegistryCount = {
  bag: string;
  count: number;
  /** Display lines for the contributes list. */
  items: string[];
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
  apiVersion: number | null;
  manifestVersion: number | null;
  loadOrder: number | null;
  entry: string | null;
  workerEntry: string | null;
  hasWorker: boolean;
  hasEntrySource: boolean;
  entrySourceBytes: number | null;
  workerSourceBytes: number | null;
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

/** Bags that are not per-mod contribution maps. */
const SKIP_REGISTRY_BAGS = new Set(["recipes", "energyPriorities"]);

function kebabToCamel(value: string): string {
  return value.replace(/-([a-z0-9])/gi, (_, ch: string) => ch.toUpperCase());
}

/**
 * Tokens used to attribute `sandkit.mods` entries to a mod.
 * Always includes `modId` / `modId:` prefixes. Long kebab last-segments also
 * match camelCase ids (e.g. `sandustry-test-blocks` → `sandustryTestBlocks…`).
 */
function ownershipTokens(modId: string): {
  prefixes: string[];
  fuzzy: string[];
} {
  const prefixes = [modId, `${modId}:`];
  const fuzzy: string[] = [];
  const last = modId.includes(".")
    ? modId.slice(modId.lastIndexOf(".") + 1)
    : modId;
  if (last.includes("-")) {
    const camel = kebabToCamel(last);
    if (camel.length >= 10) fuzzy.push(camel.toLowerCase());
  }
  return { prefixes, fuzzy };
}

function entryOwnedByMod(
  modId: string,
  key: string,
  entry: { id?: unknown } | null | undefined,
  tokens: ReturnType<typeof ownershipTokens>
): boolean {
  if (key === modId || key.startsWith(`${modId}:`)) return true;
  for (const prefix of tokens.prefixes) {
    if (prefix.endsWith(":") ? key.startsWith(prefix) : key === prefix)
      return true;
  }
  if (tokens.fuzzy.length === 0) return false;
  const id = typeof entry?.id === "string" ? entry.id : "";
  const hay = `${key}\0${id}`.toLowerCase();
  return tokens.fuzzy.some((token) => hay.includes(token));
}

function registryLabel(
  key: string,
  entry: Record<string, unknown> | null | undefined
): string {
  const id =
    typeof entry?.id === "string" && entry.id.length > 0 ? entry.id : key;
  const name =
    typeof entry?.name === "string" && entry.name.length > 0
      ? entry.name
      : null;
  return name ? `${name} · ${id}` : id;
}

function pushBag(
  out: Map<string, ModRegistryCount[]>,
  modId: string,
  bag: string,
  items: string[]
): void {
  if (items.length === 0) return;
  out.get(modId)!.push({ bag, count: items.length, items });
}

function formatSettingValue(value: unknown): string {
  if (typeof value === "boolean" || typeof value === "number")
    return String(value);
  if (typeof value === "string") return value;
  if (value == null) return "null";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function byteLength(value: unknown): number | null {
  if (typeof value === "string") return value.length;
  return null;
}

function ownedRegistryCounts(
  modIds: readonly string[],
  orderedRows: ReadonlyMap<string, Record<string, unknown>>
): Map<string, ModRegistryCount[]> {
  const out = new Map<string, ModRegistryCount[]>();
  const tokenByMod = new Map(
    modIds.map((id) => [id, ownershipTokens(id)] as const)
  );
  for (const modId of modIds) out.set(modId, []);
  try {
    const bags = (
      sandkit.engine?.state as
        | { sandkit?: { mods?: Record<string, unknown> } }
        | undefined
    )?.sandkit?.mods;
    if (bags && typeof bags === "object") {
      for (const [bag, value] of Object.entries(bags)) {
        if (SKIP_REGISTRY_BAGS.has(bag)) continue;
        if (!value || typeof value !== "object" || Array.isArray(value))
          continue;
        const byMod = new Map<string, string[]>();
        for (const [key, raw] of Object.entries(value as object)) {
          const entry =
            raw && typeof raw === "object" && !Array.isArray(raw)
              ? (raw as Record<string, unknown>)
              : null;
          for (const modId of modIds) {
            const tokens = tokenByMod.get(modId)!;
            if (!entryOwnedByMod(modId, key, entry, tokens)) continue;
            let ids = byMod.get(modId);
            if (!ids) {
              ids = [];
              byMod.set(modId, ids);
            }
            ids.push(registryLabel(key, entry));
          }
        }
        for (const [modId, ids] of byMod) pushBag(out, modId, bag, ids);
      }
    }

    const overlaysRoot = (
      sandkit.engine?.state as
        | {
            session?: {
              ui?: {
                overlays?: {
                  global?: Record<string, unknown>;
                  hotbar?: Record<string, unknown>;
                };
              };
            };
          }
        | undefined
    )?.session?.ui?.overlays;

    for (const bagName of ["global", "hotbar"] as const) {
      const overlays = overlaysRoot?.[bagName];
      if (!overlays || typeof overlays !== "object") continue;
      const byMod = new Map<string, string[]>();
      for (const id of Object.keys(overlays)) {
        for (const modId of modIds) {
          if (id !== modId && !id.startsWith(`${modId}:`)) continue;
          let ids = byMod.get(modId);
          if (!ids) {
            ids = [];
            byMod.set(modId, ids);
          }
          ids.push(
            id.startsWith(`${modId}:`) ? id.slice(modId.length + 1) : id
          );
        }
      }
      const label = bagName === "global" ? "overlays" : "hotbar";
      for (const [modId, ids] of byMod) pushBag(out, modId, label, ids);
    }

    const settingsRoot = (
      sandkit.engine?.state as
        | {
            session?: {
              settings?: {
                externalModSettings?: Record<string, Record<string, unknown>>;
              };
            };
          }
        | undefined
    )?.session?.settings?.externalModSettings;

    for (const modId of modIds) {
      const row = orderedRows.get(modId);
      const manifest =
        row?.manifest && typeof row.manifest === "object"
          ? (row.manifest as Record<string, unknown>)
          : {};
      const schema = manifest.configSchema;
      if (schema && typeof schema === "object") {
        const lines: string[] = [];
        for (const [key, raw] of Object.entries(schema as object)) {
          const def =
            raw && typeof raw === "object"
              ? (raw as Record<string, unknown>)
              : null;
          const type = typeof def?.type === "string" ? def.type : "?";
          const label =
            typeof def?.labelKey === "string" && def.labelKey.length > 0
              ? def.labelKey
              : key;
          lines.push(`${key} · ${type}${label !== key ? ` · ${label}` : ""}`);
        }
        pushBag(out, modId, "config", lines);
      }

      const live = settingsRoot?.[modId];
      if (live && typeof live === "object") {
        const lines = Object.entries(live).map(
          ([key, value]) => `${key} = ${formatSettingValue(value)}`
        );
        pushBag(out, modId, "settings", lines);
      }
    }
  } catch {
    /* ignore */
  }

  // Stable bag order for the UI.
  const bagOrder = [
    "structures",
    "elements",
    "terrains",
    "items",
    "projectiles",
    "energy",
    "triggers",
    "matters",
    "misc",
    "upgrading",
    "debug",
    "overlays",
    "hotbar",
    "config",
    "settings"
  ];
  for (const [modId, list] of out) {
    list.sort((a, b) => {
      const ia = bagOrder.indexOf(a.bag);
      const ib = bagOrder.indexOf(b.bag);
      const ra = ia === -1 ? 999 : ia;
      const rb = ib === -1 ? 999 : ib;
      if (ra !== rb) return ra - rb;
      return a.bag.localeCompare(b.bag);
    });
    out.set(modId, list);
  }
  return out;
}

function parseDiagnostic(entry: unknown): ModDiagnostic | null {
  if (!entry || typeof entry !== "object") return null;
  const row = entry as Record<string, unknown>;
  return {
    code: stringField(row.code, "?"),
    modId: stringField(row.modId) || null,
    message: stringField(row.message)
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
  if (reportCache && now - reportCache.at < REPORT_CACHE_MS)
    return reportCache.value;
  const value = buildModReportUncached();
  reportCache = { at: now, value };
  return value;
}

function buildModReportUncached(): ModReport | null {
  try {
    const external = (
      sandkit.engine?.state as
        | { session?: { externalMods?: ExternalModsSession } }
        | undefined
    )?.session?.externalMods;
    if (!external) return null;

    const ordered = Array.isArray(external.orderedMods)
      ? external.orderedMods
      : [];
    const statuses = Array.isArray(external.statuses) ? external.statuses : [];
    const diagnosticsRaw = Array.isArray(external.diagnostics)
      ? external.diagnostics
      : [];
    const missingRaw = Array.isArray(external.missingSavedMods)
      ? external.missingSavedMods
      : [];

    const statusById = new Map<string, { status?: string; error?: string }>();
    for (const entry of statuses) {
      if (!entry || typeof entry !== "object") continue;
      const id = stringField((entry as { id?: unknown }).id);
      if (id) statusById.set(id, entry as { status?: string; error?: string });
    }

    const mods: ModReportEntry[] = [];
    const modIds: string[] = [];
    const rows: Array<{
      index: number;
      row: Record<string, unknown>;
      id: string;
    }> = [];
    const orderedById = new Map<string, Record<string, unknown>>();
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
      orderedById.set(id, row);
    }

    const registryByMod = ownedRegistryCounts(modIds, orderedById);

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
          ? manifest.dependencies.filter(
              (dep): dep is string => typeof dep === "string"
            )
          : [],
        hasSettings,
        itemId,
        source,
        discoveredVia: [...discoveredVia],
        sourceKind,
        folder: workshopFolderFromRecord(row),
        apiVersion: numberField(manifest.apiVersion),
        manifestVersion: numberField(manifest.manifestVersion),
        loadOrder: numberField(manifest.loadOrder),
        entry: stringField(manifest.entry) || null,
        workerEntry: stringField(manifest.worker) || null,
        hasWorker: hasPayload(row.workerSource),
        hasEntrySource: hasPayload(row.entrySource),
        entrySourceBytes: byteLength(row.entrySource),
        workerSourceBytes: byteLength(row.workerSource),
        registry: registryByMod.get(id) ?? []
      });
    }

    const missing = missingRaw.filter(
      (id): id is string => typeof id === "string"
    );
    const missingSet = new Set(missing);

    const diagnostics = diagnosticsRaw
      .map(parseDiagnostic)
      .filter((entry): entry is ModDiagnostic => entry !== null)
      .filter(
        (entry) =>
          entry.code !== "missing_saved_mod" &&
          !(entry.modId !== null && missingSet.has(entry.modId))
      );

    const loadedCount = mods.filter((mod) => mod.status === "loaded").length;
    const problemCount =
      mods.filter((mod) => mod.status === "failed" || mod.status === "blocked")
        .length + missing.length;

    return { mods, diagnostics, missing, loadedCount, problemCount };
  } catch {
    return null;
  }
}
