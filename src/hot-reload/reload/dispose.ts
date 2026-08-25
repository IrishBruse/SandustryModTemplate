const DISPOSE_LISTS_KEY = "__sandkitDisposeLists__";

type DisposeGlobals = {
  [DISPOSE_LISTS_KEY]?: Record<string, Array<() => void>>;
};

function globals(): typeof globalThis & DisposeGlobals {
  return globalThis as typeof globalThis & DisposeGlobals;
}

export function disposeLists(): Record<string, Array<() => void>> {
  const g = globals();
  if (!g[DISPOSE_LISTS_KEY]) g[DISPOSE_LISTS_KEY] = {};
  return g[DISPOSE_LISTS_KEY];
}

/** Register a disposer for a later reload of this mod. */
export function pushDispose(modId: string, fn: () => void): void {
  if (typeof fn !== "function" || modId.length === 0) return;
  const lists = disposeLists();
  if (!lists[modId]) lists[modId] = [];
  lists[modId].push(fn);
}

/** Run and clear the list for one mod. Failures do not stop the rest. */
export function runDisposers(modId: string): void {
  const lists = disposeLists();
  const list = lists[modId];
  if (!list || list.length === 0) return;
  lists[modId] = [];
  for (const fn of list) {
    try {
      fn();
    } catch (error) {
      console.warn(`dispose failed for ${modId}`, error);
    }
  }
}
