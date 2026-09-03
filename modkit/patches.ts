/**
 * Bundle patch helpers — use `patches.json` or `patches.ts`.
 *
 * Shapes come from `@sandustry-modding/types/configs` (`BundlePatch` and related).
 *
 * Prefer Sandkit API before patches. Use patches only when public API cannot
 * do the job. Keep replacements small, set `expectedMatches`, and put runtime
 * helpers on `globalThis` (patch code runs outside the bundle IIFE).
 *
 * Prefer `patches.json`. Use `patches.ts` only for typed helpers or `debugPatches`.
 *
 * Author either:
 *
 * - `patches.json` — bare array; IDE validation via `.vscode/settings.json` schema map
 * - `patches.ts` — `export const patches = definePatches([...])`
 *
 * When both patch files exist, the build loads **`patches.ts` first**.
 * If `modinfo.ts` has no patch exports, the build falls back to `patches.ts` /
 * `patches.json`. `debugPatches` are supported from `patches.ts` (or `modinfo.ts`
 * re-exports) only.
 *
 * ```ts
 * import { definePatches } from "@modkit/patches";
 *
 * export const patches = definePatches([
 *   {
 *     id: "bundle-log-prefix",
 *     file: "js/bundle.js",
 *     find: "initializing workers",
 *     operation: "insertBefore",
 *     code: "[patched]",
 *     expectedMatches: 1,
 *   },
 * ]);
 * ```
 *
 * The browser bundle stubs this module (`modkit/internal/esbuild/patches.empty.ts`)
 * so patch payloads stay out of `main.js`. Build-time `build-patches.js` still
 * resolves the real module.
 */

import type { BundlePatch, BundlePatchRegex } from "@sandustry-modding/types/configs";

export type {
  BundlePatch,
  BundlePatchRegex,
  BundlePatchesFile,
  PatchOperation,
  PatchTargetFile,
} from "@sandustry-modding/types/configs";

/** One entry in the `patches` / `debugPatches` list. */
export type Patch = BundlePatch;

/** @deprecated Use {@link BundlePatchRegex}. */
export type PatchRegex = BundlePatchRegex;

/**
 * Type-safe patch list for `patches.ts`.
 *
 * ```ts
 * export const patches = definePatches([ ... ]);
 * ```
 */
export function definePatches<const T extends readonly BundlePatch[]>(patches: T): T {
  return patches;
}

/** Shared framework patches. Empty by default. */
export const modkitDebugPatches = definePatches([]);
