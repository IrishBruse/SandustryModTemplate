import type { SandkitApi } from "types/api";
import type { SandkitGlobal } from "types/sandkit";
import { modManifest } from "../modinfo";

export interface ModGlobal {
  modId: string;
  api: SandkitApi;
  sandkit: SandkitGlobal;
}

export const MOD_ID = modManifest.id;

export function installGlobals(api: SandkitApi): ModGlobal {
  return {
    modId: MOD_ID,
    api,
    sandkit,
  };
}
