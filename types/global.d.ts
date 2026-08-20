/// Sandkit globals provided by the Sandustry mod runtime.

import type { SandkitApi, SandkitGlobal } from "./index";

declare global {
  /** Set at build time — true for dev/game builds, false for release. */
  const __MOD_DEBUG__: boolean;

  // eslint-disable-next-line no-var
  var sandkit: SandkitGlobal;

  interface Window {
    sandkit: SandkitGlobal;
    api: SandkitApi;
    enums: SandkitGlobal["enums"];
    react: typeof import("react");
  }

  // eslint-disable-next-line no-var
  var api: SandkitApi;
  // eslint-disable-next-line no-var
  var enums: SandkitGlobal["enums"];
  // eslint-disable-next-line no-var
  var react: typeof import("react");
}

export {};
