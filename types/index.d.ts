/**
 * Sandustry modding types for TypeScript mod authors and IDE tooling.
 *
 * ## Execution model
 *
 * - Entry files run as plain script bodies via `new Function(...)`.
 * - Do not use `import` or `export` in mod entry files.
 * - `sandkit` and `api` are already in global scope.
 * - `main.js` runs on the main thread; `worker.js` runs on worker threads.
 *
 * ## API source of truth
 *
 * Method names come from the in-game runtime dump (`sandkit-api/runtime-dump.json`).
 * Descriptions live in `sandkit-api/api-docs.json` (merged on `npm run generate-types`).
 */

export type * from "./common";
export type * from "./sandkit";
export type * from "./mod/manifest";
export type * from "./mod/patches";
export type * from "./api";

export type { SandkitApi } from "./api";
export type { ModManifest, ConfigSchema } from "./mod/manifest";
export type { Patch, PatchOperation } from "./mod/patches";
