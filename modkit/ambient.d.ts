/// <reference path="./types/global.d.ts" />

/**
 * Template-only ambient bindings (not in sandustry-modding-types).
 */
declare global {
  /**
   * True when this `main.js` eval is a hot-reload pass.
   * Debug builds set it via esbuild inject (`modkit/internal/esbuild/hot-reload.inject.ts`).
   * Release builds define it as `false`.
   */
  const reloaded: boolean;

  /** Worker-thread `sandkit.api` shape — use in `worker.ts`. */
  type WorkerSandkitApi = import("./types/worker/sandkit-api").WorkerSandkitApi;
}

export {};
