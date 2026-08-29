import { wrapSandkit } from "./wrap-api.ts";

export const DEV_TOOLS_WRAP_SANDKIT_KEY = "__devToolsWrapSandkit";

type WrapFn = (modId: string, host: { api: object }) => { api: object };

type WrapGlobals = typeof globalThis & {
  [DEV_TOOLS_WRAP_SANDKIT_KEY]?: WrapFn;
};

/**
 * Install the hot-reload sandkit wrap (dispose tracking) for other mods.
 * Safe to call from companion `main.js` even when other mods already evaluated.
 */
export function installFirstLoadApiWrap(selfId: string): void {
  const g = globalThis as WrapGlobals;
  g[DEV_TOOLS_WRAP_SANDKIT_KEY] = (modId, host) => {
    if (modId === selfId) return host;
    return wrapSandkit(host, modId);
  };
}
