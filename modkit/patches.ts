/**
 * Bundle patch helpers and `definePatches`.
 *
 * Shapes come from `@sandustry-modding/types/configs` (`BundlePatch` and related).
 *
 * Prefer Sandkit API before patches. Use patches only when public API cannot
 * do the job. Keep replacements small, set `expectedMatches`, and put runtime
 * helpers on `globalThis` (patch code runs outside the bundle IIFE).
 *
 * Export `patches` / `debugPatches` from `src/<name>/modinfo.ts` (or from
 * `patches.ts` and re-export). The build writes `patches.json`.
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
 * Type-safe patch list builder.
 * The build writes the list to `patches.json`.
 *
 * ```ts
 * export const patches = definePatches([ ... ]);
 * ```
 */
export function definePatches<const T extends readonly BundlePatch[]>(patches: T): T {
  return patches;
}

/** Shared framework patches. Empty — auto-load last save lives on dev-tools. */
export const modkitDebugPatches = definePatches([]);
