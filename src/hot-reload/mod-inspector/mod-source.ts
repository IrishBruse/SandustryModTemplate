/** How the host discovered an external mod folder. */
export type DiscoveredVia = "local" | "subscribed" | "root-scan" | string;

export type ModSourceKind = "core" | "local" | "workshop" | "unknown";

export type ElementSourceKind = "core" | "core-mod" | "mod";

type WorkshopMeta = {
  discoveredVia?: unknown;
};

export function discoveredViaFromRecord(record: unknown): DiscoveredVia[] {
  if (!record || typeof record !== "object") return [];
  const workshop = (record as { workshop?: unknown }).workshop;
  if (!workshop || typeof workshop !== "object") return [];
  const via = (workshop as WorkshopMeta).discoveredVia;
  if (!Array.isArray(via)) return [];
  return via.filter((entry): entry is DiscoveredVia => typeof entry === "string");
}

export function workshopItemIdFromRecord(record: unknown): string | null {
  if (!record || typeof record !== "object") return null;
  const workshop = (record as { workshop?: unknown }).workshop;
  if (!workshop || typeof workshop !== "object") return null;
  const itemId = (workshop as { itemId?: unknown }).itemId;
  if (itemId == null) return null;
  const text = String(itemId);
  return text.length > 0 ? text : null;
}

export function workshopFolderFromRecord(record: unknown): string | null {
  if (!record || typeof record !== "object") return null;
  const workshop = (record as { workshop?: unknown }).workshop;
  if (!workshop || typeof workshop !== "object") return null;
  const folder = (workshop as { folder?: unknown }).folder;
  return typeof folder === "string" && folder.length > 0 ? folder : null;
}

export function rootUrlFromRecord(record: unknown): string | null {
  if (!record || typeof record !== "object") return null;
  const rootUrl = (record as { rootUrl?: unknown }).rootUrl;
  return typeof rootUrl === "string" && rootUrl.length > 0 ? rootUrl : null;
}

/**
 * Classify an external mod record.
 * - `local` — app-data mods folder
 * - `workshop` — Steam item (`subscribed`, or `root-scan` with an item id)
 * - `core` — `root-scan` with no Workshop item id (depot-shipped)
 */
export function modSourceKind(
  via: readonly DiscoveredVia[],
  itemId?: string | null,
): ModSourceKind {
  if (via.includes("local")) return "local";
  if (via.includes("subscribed")) return "workshop";
  if (itemId) return "workshop";
  if (via.includes("root-scan")) return "core";
  return "unknown";
}

export function modSourceLabel(kind: ModSourceKind): string {
  if (kind === "core") return "Core mod";
  if (kind === "local") return "Local";
  if (kind === "workshop") return "Workshop";
  return "Unknown";
}

/** Mod ids from `session.externalMods.orderedMods` (user-installed external mods). */
export function externalModIdSet(): Set<string> {
  const out = new Set<string>();
  try {
    const ordered = (
      sandkit.engine?.state as
        | { session?: { externalMods?: { orderedMods?: unknown } } }
        | undefined
    )?.session?.externalMods?.orderedMods;
    if (!Array.isArray(ordered)) return out;
    for (const entry of ordered) {
      if (!entry || typeof entry !== "object") continue;
      const manifest = (entry as { manifest?: unknown }).manifest;
      const id =
        manifest && typeof manifest === "object"
          ? (manifest as { id?: unknown }).id
          : (entry as { id?: unknown }).id;
      if (typeof id === "string" && id.length > 0) out.add(id);
    }
  } catch {
    /* ignore */
  }
  return out;
}

/** Parse owning mod id from a sandkit mod registry entry (`modId:localId`). */
export function modIdFromRegistryEntry(entry: { id?: string } | undefined): string | null {
  const id = entry?.id;
  if (!id) return null;
  const colon = id.indexOf(":");
  return colon > 0 ? id.slice(0, colon) : null;
}

/**
 * Element origin for the inspector.
 * - `core` — built-in enum types (Sand, Water, …)
 * - `core-mod` — shipped mod content (not owned by a loaded external mod)
 * - `mod` — registered by a loaded external mod
 */
export function elementSourceKind(
  elementType: number,
  registryEntry: { id?: string } | undefined,
  externalModIds: Set<string>,
  isBuiltInType: (type: number) => boolean,
): ElementSourceKind {
  if (isBuiltInType(elementType)) return "core";
  const owner = modIdFromRegistryEntry(registryEntry);
  if (owner && externalModIds.has(owner)) return "mod";
  return "core-mod";
}

export function elementSourceLabel(kind: ElementSourceKind): string {
  if (kind === "core") return "Core";
  if (kind === "core-mod") return "Core mod";
  return "Mod";
}
