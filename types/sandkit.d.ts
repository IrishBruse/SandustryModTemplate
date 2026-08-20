import type { SandkitApi } from "./api";
import type { SandkitEnums } from "./enums";

/**
 * Sandkit runtime globals.
 *
 * Entry files run as script bodies — `sandkit` and `api` are in scope.
 * Do not use `import` or `export` in mod entry files.
 *
 * ## Engine escape hatch
 *
 * ```ts
 * sandkit.engine.api;
 * sandkit.engine.state;
 * ```
 */
export interface SandkitGlobal {
  api: SandkitApi;
  react: typeof import("react");
  state: unknown;
  enums: SandkitEnums;
  engine: SandkitEngine;
}

export interface SandkitEngine {
  api: unknown;
  state: unknown;
}
