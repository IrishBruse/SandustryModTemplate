/**
 * Cleanup registry for the debug companion hot-eval.
 * Release builds stub this module to a no-op.
 *
 * Keys must match `src/debug/loader-patches.ts` and `src/debug/hot-eval.ts`.
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
 * Register cleanup that runs before a renderer hot-eval.
 * No-op when the debug companion has not set an active mod id.
 */
export function onDispose(fn: () => void): () => void {
  if (typeof fn !== "function") return () => {};

  const modId = globals()[ACTIVE_KEY];
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
