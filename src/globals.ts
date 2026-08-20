import type { SandkitApi } from "types/api";
import type { SandkitGlobal } from "types/sandkit";

export interface ModGlobal {
  modId: string;
  api: SandkitApi;
  sandkit: SandkitGlobal;
}

const MOD_ID = "author.example-mod";

export function installGlobals(api: SandkitApi): ModGlobal {
  return {
    modId: MOD_ID,
    api,
    sandkit,
  };
}

export { MOD_ID };
