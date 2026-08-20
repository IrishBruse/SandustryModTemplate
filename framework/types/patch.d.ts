/**
 * `patches.json` — bundle rewrites at mod load time.
 *
 * Prefer Sandkit API before patches. Use patches only when public API cannot
 * do the job. Keep replacements small, set `expectedMatches`, and put runtime
 * helpers on `globalThis` (patch code runs outside the bundle IIFE).
 *
 * Define patches with `definePatches` in root `patches.ts`.
 *
 * @example
 * ```ts
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
 */

export type PatchOperation = "insertBefore" | "replace" | "wrap";

/** Regex match — use only when exact `find` is not stable enough. */
export interface PatchRegex {
  pattern: string;
  flags?: string;
}

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
  find: string;
  regex?: never;
}

export interface PatchRegexMatch extends PatchBase {
  regex: PatchRegex;
  find?: never;
}

export type PatchMatch = PatchFind | PatchRegexMatch;

/** Insert `code` before each match. */
export type InsertBeforePatch = PatchMatch & {
  operation: "insertBefore";
  code: string;
};

/** Replace each match with `code`. */
export type ReplacePatch = PatchMatch & {
  operation: "replace";
  code: string;
};

/** Wrap each match with `before` + match + `after`. */
export type WrapPatch = PatchMatch & {
  operation: "wrap";
  before: string;
  after: string;
};

export type Patch = InsertBeforePatch | ReplacePatch | WrapPatch;
