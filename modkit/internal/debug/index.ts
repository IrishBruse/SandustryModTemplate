/**
 * Cleanup registry for extra dispose callbacks (timers, DOM).
 * With no loader wrap, `onDispose` is a no-op until a future reload sets the active mod id.
 */

const ACTIVE_KEY = "__sandkitHotReloadActive__";
const DISPOSE_LISTS_KEY = "__sandkitDisposeLists__";

type DisposeGlobals = {
  [ACTIVE_KEY]?: string;
  [DISPOSE_LISTS_KEY]?: Record<string, Array<() => void>>;
};

function globals(): typeof globalThis & DisposeGlobals {
  return globalThis as typeof globalThis & DisposeGlobals;
}

function disposeLists(): Record<string, Array<() => void>> {
  const g = globals();
  if (!g[DISPOSE_LISTS_KEY]) g[DISPOSE_LISTS_KEY] = {};
  return g[DISPOSE_LISTS_KEY];
}

/**
 * Mod id from the loader wrapper at this bundle's first evaluation.
 * Call-time `__sandkitHotReloadActive__` is the last mod that ran, so delayed
 * `onDispose` from `game:ready` would land on the wrong list without this.
 */
const OWNER_ID = globals()[ACTIVE_KEY];

/**
 * Register cleanup for a future reload pass.
 * No-op when this bundle evaluated with no active mod id.
 */
export function onDispose(fn: () => void): () => void {
  if (typeof fn !== "function") return () => {};

  const modId = OWNER_ID;
  if (!modId) return () => {};

  const lists = disposeLists();
  if (!lists[modId]) lists[modId] = [];
  lists[modId].push(fn);
  return () => {
    const list = lists[modId];
    if (!list) return;
    const index = list.indexOf(fn);
    if (index >= 0) list.splice(index, 1);
  };
}
