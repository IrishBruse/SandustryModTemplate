/**
 * Bundle patch shapes and `definePatches`.
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

/** How a patch changes each match. */
export type PatchOperation = "insertBefore" | "replace" | "wrap";

/** Regex match — use only when exact `find` is not stable enough. */
export interface PatchRegex {
  /** Regex pattern string (not a `RegExp` literal). */
  pattern: string;
  /** Optional flags (for example `"g"`). */
  flags?: string;
}

/** Shared fields for every patch. */
interface PatchBase {
  /** Unique patch id. */
  id: string;
  /** Target file under the game bundle, e.g. `js/bundle.js`. */
  file: string;
  /** Fail mod load if match count differs. */
  expectedMatches: number;
  /** All patches in the group must succeed together. */
  atomicGroup?: string;
}

/** Exact string match — preferred over regex. */
export interface PatchFind extends PatchBase {
  /** Exact substring to match. */
  find: string;
  regex?: never;
}

/** Regex-based match. Prefer `PatchFind` when the text is stable. */
export interface PatchRegexMatch extends PatchBase {
  regex: PatchRegex;
  find?: never;
}

/** Either exact or regex match fields on a patch. */
export type PatchMatch = PatchFind | PatchRegexMatch;

/** Insert `code` before each match. */
export type InsertBeforePatch = PatchMatch & {
  operation: "insertBefore";
  /** Text inserted before each match. */
  code: string;
};

/** Replace each match with `code`. */
export type ReplacePatch = PatchMatch & {
  operation: "replace";
  /** Replacement text for each match. */
  code: string;
};

/** Wrap each match with `before` + match + `after`. */
export type WrapPatch = PatchMatch & {
  operation: "wrap";
  /** Text inserted before each match. */
  before: string;
  /** Text inserted after each match. */
  after: string;
};

/** One entry in the `patches` / `debugPatches` list. */
export type Patch = InsertBeforePatch | ReplacePatch | WrapPatch;

/**
 * Type-safe patch list builder.
 * The build writes the list to `patches.json`.
 *
 * ```ts
 * export const patches = definePatches([ ... ]);
 * ```
 */
export function definePatches<const T extends readonly Patch[]>(patches: T): T {
  return patches;
}

/** Shared framework patches. Empty — auto-load last save lives on dev-tools. */
export const modkitDebugPatches = definePatches([]);
