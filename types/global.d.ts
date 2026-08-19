/// Sandkit globals provided by the Sandustry mod runtime.
///
/// Entry files run as plain script bodies via `new Function(...)`.
/// `sandkit` and `api` are in scope. Do not use `import` or `export`.

import type { SandkitApi, SandkitGlobal, SandustryElectronBridge } from "./index";

declare global {
  const sandkit: SandkitGlobal;

  interface Window {
    api: SandkitApi;
    electron?: SandustryElectronBridge;
  }

  // eslint-disable-next-line no-var
  var api: SandkitApi;
}

export {};
