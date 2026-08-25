export type LocalMod = {
  id: string;
  mainUrl: string;
};

/** Game store key for the loaded local/workshop mod list. */
export const EXTERNAL_RUNTIME_KEY = "__sandkitExternalRuntimeV1";

function idFromEntry(entry: unknown): string | null {
  if (typeof entry === "string" && entry.length > 0) return entry;
  if (!entry || typeof entry !== "object") return null;
  const rec = entry as Record<string, unknown>;
  for (const key of ["id", "modId", "modName", "name"] as const) {
    const value = rec[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return null;
}

/** Collect loaded mod ids from the external runtime `order` list. Skip `skipId`. */
export function collectModIds(mods: unknown, skipId: string): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();

  function add(id: string | null): void {
    if (!id || id === skipId || seen.has(id)) return;
    seen.add(id);
    ids.push(id);
  }

  if (Array.isArray(mods)) {
    for (const entry of mods) add(idFromEntry(entry));
    return ids;
  }

  if (mods && typeof mods === "object") {
    for (const [key, value] of Object.entries(mods)) {
      add(idFromEntry(value) ?? (key.length > 0 ? key : null));
    }
  }

  return ids;
}

function replaceOnce(haystack: string, from: string, to: string): string | null {
  const index = haystack.indexOf(from);
  if (index < 0) return null;
  return haystack.slice(0, index) + to + haystack.slice(index + from.length);
}

/**
 * Build another mod's `main.js` URL from this companion's `assets.getUrl("main.js")`.
 * Falls back to `sandkit-workshop://<id>/main.js` when the self URL has no id folder.
 */
export function rewriteMainUrl(selfMainUrl: string, selfId: string, otherId: string): string {
  if (selfId.length === 0 || selfId === otherId) {
    return `sandkit-workshop://${otherId}/main.js`;
  }

  const encodedSelf = encodeURIComponent(selfId);
  const encodedOther = encodeURIComponent(otherId);
  const pairs: Array<[string, string]> = [
    [`://${selfId}/`, `://${otherId}/`],
    [`://${encodedSelf}/`, `://${encodedOther}/`],
    [`/${selfId}/`, `/${otherId}/`],
    [`/${encodedSelf}/`, `/${encodedOther}/`],
    [`\\${selfId}\\`, `\\${otherId}\\`],
  ];

  for (const [from, to] of pairs) {
    const next = replaceOnce(selfMainUrl, from, to);
    if (next) return next;
  }

  return `sandkit-workshop://${otherId}/main.js`;
}

export function discoverLocalMods(
  selfId: string,
  selfMainUrl: string,
  modsState: unknown,
): LocalMod[] {
  return collectModIds(modsState, selfId).map((id) => ({
    id,
    mainUrl: rewriteMainUrl(selfMainUrl, selfId, id),
  }));
}

/** Read `store.mods.__sandkitExternalRuntimeV1.order`. Not `state.sandkit.mods` (game content). */
export function modsStateFromStore(storeMods: unknown): unknown {
  if (!storeMods || typeof storeMods !== "object") return undefined;
  const ext = (storeMods as Record<string, unknown>)[EXTERNAL_RUNTIME_KEY];
  if (!ext || typeof ext !== "object") return undefined;
  const order = (ext as { order?: unknown }).order;
  return Array.isArray(order) ? order : undefined;
}

export function readModsState(): unknown {
  try {
    const store = sandkit.engine?.state?.store as { mods?: unknown } | undefined;
    return modsStateFromStore(store?.mods);
  } catch {
    return undefined;
  }
}
