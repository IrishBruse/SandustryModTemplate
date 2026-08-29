const GENERATIONS_KEY = "__sandkitHotGenerations__";

type GenerationGlobals = {
  [GENERATIONS_KEY]?: Record<string, number>;
};

function store(): Record<string, number> {
  const g = globalThis as typeof globalThis & GenerationGlobals;
  if (!g[GENERATIONS_KEY]) g[GENERATIONS_KEY] = {};
  return g[GENERATIONS_KEY];
}

/** Next hot-eval generation for this mod (1 on first reload). */
export function nextHotGeneration(modId: string): number {
  const map = store();
  const n = (map[modId] ?? 0) + 1;
  map[modId] = n;
  return n;
}

/** Current generation, or 0 if this mod has not hot-evaled yet. */
export function hotGeneration(modId: string): number {
  return store()[modId] ?? 0;
}
