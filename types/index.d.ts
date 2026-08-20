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
 * ## Patches
 *
 * Patch source files are raw JavaScript. Leading `// @file`, `// @find`, and
 * `// @expectedMatches` comments set the other fields; the filename is the id.
 * See `src/patches/README.md`. `Patch` in `types/framework/patch.d.ts` is the
 * compiled `patches.json` object, not the source file.
 *
 * ## API source of truth
 *
 * Method names come from the in-game runtime dump (`types/api/source/runtime-dump.json`).
 * Param and return types come from `types/api/source/official-api-reference.txt` (merged on generate).
 * Descriptions live in `types/api/source/api-docs.json` (merged on `npm run generate-types`).
 */

export type * from "./common";
export type * from "./enums";
export type * from "./engine";
export type * from "./sandkit";
export type * from "./framework";
export type * from "./api";

export type { SandkitApi } from "./api";
export type { ModManifest, ConfigSchema } from "./framework/manifest";
export type { Patch, PatchOperation } from "./framework/patch";
