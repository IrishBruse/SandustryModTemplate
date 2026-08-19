import type { SandkitApi } from "types/api";
import type { SandkitGlobal } from "types/sandkit";

export interface ModGlobal {
  modId: string;
  api: SandkitApi;
  sandkit: SandkitGlobal;
}

const MOD_ID = "author.example-mod";

export function installGlobals(api: SandkitApi): ModGlobal {
  const modGlobal: ModGlobal = {
    modId: MOD_ID,
    api,
    sandkit,
  };

  globalThis.api = api;
  window.api = api;

  return modGlobal;
}

export { MOD_ID };
