import { modinfo } from "./mod";

export interface ModGlobal {
  modId: string;
  api: SandkitApi;
  sandkit: Sandkit;
}

export const MOD_ID = modinfo.id;

export function installGlobals(api: SandkitApi): ModGlobal {
  return {
    modId: MOD_ID,
    api,
    sandkit,
  };
}
