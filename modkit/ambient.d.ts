import "./types/global";

/**
 * Template-only ambient bindings (not part of the Sandkit API types).
 */
declare global {
  /** Worker-thread `sandkit.api` shape — use in `worker.ts`. */
  type WorkerSandkitApi = import("./types/worker/sandkit-api").WorkerSandkitApi;
}

export {};
