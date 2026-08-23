import "./types/global";

/**
 * Template-only ambient bindings (not part of the Sandkit API types).
 */
declare global {
  /**
   * True when this `main.js` eval is a hot-reload pass.
   * Debug builds set it via the debug companion loader patch.
   * Release builds define it as `false`.
   */
  const reloaded: boolean;

  /** Worker-thread `sandkit.api` shape — use in `worker.ts`. */
  type WorkerSandkitApi = import("./types/worker/sandkit-api").WorkerSandkitApi;
}

export {};
