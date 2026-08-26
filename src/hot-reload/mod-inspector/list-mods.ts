/** Loaded mod rows for Mod Inspector. */

import {
  discoveredViaFromRecord,
  modSourceKind,
  workshopItemIdFromRecord,
  type ModSourceKind,
} from "./mod-source";

export type ListedMod = {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  sourceKind: ModSourceKind;
};

function stringField(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function fromOrderedEntry(entry: unknown): ListedMod | null {
  if (!entry || typeof entry !== "object") return null;
  const manifest = (entry as { manifest?: unknown }).manifest;
  const man =
    manifest && typeof manifest === "object" ? (manifest as Record<string, unknown>) : null;
  const id = stringField(man?.id) || stringField((entry as { id?: unknown }).id);
  if (!id) return null;

  const sourceKind = modSourceKind(discoveredViaFromRecord(entry), workshopItemIdFromRecord(entry));

  return {
    id,
    name: stringField(man?.name, id),
    version: stringField(man?.version, "—"),
    author: stringField(man?.author, "—"),
    description: stringField(man?.description),
    sourceKind,
  };
}

/** All mods in load order from `session.externalMods.orderedMods`. */
export function listLoadedMods(): ListedMod[] {
  try {
    const session = sandkit.engine?.state?.session as
      | { externalMods?: { orderedMods?: unknown } }
      | undefined;
    const ordered = session?.externalMods?.orderedMods;
    if (!Array.isArray(ordered)) return [];
    const out: ListedMod[] = [];
    const seen = new Set<string>();
    for (const entry of ordered) {
      const row = fromOrderedEntry(entry);
      if (!row || seen.has(row.id)) continue;
      seen.add(row.id);
      out.push(row);
    }
    return out;
  } catch {
    return [];
  }
}

export function readUiScale(): number {
  try {
    const settings = (
      sandkit.engine?.state as { session?: { settings?: { uiScale?: number } } } | undefined
    )?.session?.settings;
    const scale = settings?.uiScale;
    return typeof scale === "number" && scale > 0 ? scale : 1;
  } catch {
    return 1;
  }
}
