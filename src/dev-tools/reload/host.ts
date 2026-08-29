export const SANDKIT_BY_MOD_KEY = "__sandkitByMod";

export type SandkitHost = { api: object };

type HostGlobals = typeof globalThis & {
  [SANDKIT_BY_MOD_KEY]?: Record<string, SandkitHost>;
};

function isHost(value: unknown): value is SandkitHost {
  if (!value || typeof value !== "object") return false;
  const api = (value as { api?: unknown }).api;
  return typeof api === "object" && api !== null;
}

/** Look up the first-load `sandkit` for a mod. Missing means skip hot eval. */
export function sandkitHostForMod(
  modId: string,
  globals: typeof globalThis = globalThis,
): SandkitHost | null {
  if (modId.length === 0) return null;
  const bag = (globals as HostGlobals)[SANDKIT_BY_MOD_KEY];
  if (!bag || typeof bag !== "object") return null;
  const host = bag[modId];
  return isHost(host) ? host : null;
}
