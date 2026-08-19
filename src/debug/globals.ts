import type { SandkitApi } from "types/api";
import type { ModGlobal } from "types/sandkit";
import { exampleProbe } from "./probe";

const MOD_ID = "author.example-mod";

export function installGlobals(api: SandkitApi): ModGlobal {
  const modGlobal: ModGlobal = {
    modId: MOD_ID,
    api,
    ctx: sandkit.state,
    sandkit,
    status: { loaded: true, retroConsole: false, error: null },
    registerGame(definition) {
      api.retroConsole?.registerGame(definition);
    },
    registerProbe() {
      api.retroConsole?.registerGame(exampleProbe);
      this.status.retroConsole = Boolean(api.retroConsole);
      return exampleProbe.id;
    },
  };

  try {
    globalThis.api = api;
    window.api = api;
  } catch (error) {
    modGlobal.status.error = String(
      (error as Error)?.message ?? error,
    );
  }

  return modGlobal;
}

export { MOD_ID };
