/// Sandkit globals provided by the Sandustry mod runtime.

import type { SandkitApi, SandkitGlobal } from "./index";

declare global {
  const sandkit: SandkitGlobal;

  interface Window {
    api: SandkitApi;
  }

  // eslint-disable-next-line no-var
  var api: SandkitApi;
}

export {};
