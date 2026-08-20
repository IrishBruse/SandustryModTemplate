/**
 * Framework types — manifest, patches, and other kit contracts.
 * Sandkit game API types live in `types/api/`.
 *
 * Patch **source** files (`src/patches`, `framework/patches`) are raw JS with
 * `// @file` / `// @find` / `// @expectedMatches` comments. See `src/patches/README.md`.
 * `patch.d.ts` describes the compiled `patches.json` objects.
 */

export type * from "./manifest";
export type * from "./patch";

export type { ModManifest, ConfigSchema } from "./manifest";
export type { Patch, PatchOperation } from "./patch";
