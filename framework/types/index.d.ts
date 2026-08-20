/**
 * Framework types — manifest, patches, and other kit contracts.
 * Sandkit game API types live in the `types/` submodule (`types/src/`).
 * `api.d.ts`, `sandkit.d.ts`, and `engine.d.ts` compose those namespaces for
 * the `types/api`, `types/sandkit`, and `types/engine` import paths.
 *
 * Define patches with `definePatches` in root `patches.ts` (see that file and
 * `src/patches/README.md`). `patch.d.ts` describes the `patches.json` objects.
 */

export type * from "./manifest";
export type * from "./patch";

export type { ModManifest, ConfigSchema } from "./manifest";
export type { Patch, PatchOperation } from "./patch";
export type { SandkitApi } from "./api";
export type { SandkitGlobal } from "./sandkit";
export type {
  RetroConsoleApi,
  RetroConsoleDisplay,
  RetroConsoleGame,
} from "./engine";
