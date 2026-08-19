/// Sandkit globals provided by the Sandustry mod runtime.

import type { SandkitApi, SandkitGlobal } from "./index";

declare global {
  /** Set at build time — true for dev/game builds, false for release. */
  const __MOD_DEBUG__: boolean;

  const sandkit: SandkitGlobal;

  interface Window {
    api: SandkitApi;
  }

  // eslint-disable-next-line no-var
  var api: SandkitApi;
}

export {};
