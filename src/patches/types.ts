export type PatchOperation = "insertBefore" | "replace" | "wrap";

export type PatchRegex = {
  pattern: string;
  flags?: string;
};

type PatchBase = {
  id: string;
  /** Must be a relative path under js/ (e.g. js/bundle.js). */
  file: string;
  expectedMatches: number;
  atomicGroup?: string;
};

export type PatchFind = PatchBase & {
  find: string;
  regex?: never;
};

export type PatchRegexMatch = PatchBase & {
  regex: PatchRegex;
  find?: never;
};

export type PatchMatch = PatchFind | PatchRegexMatch;

export type InsertBeforePatch = PatchMatch & {
  operation: "insertBefore";
  code: string;
};

export type ReplacePatch = PatchMatch & {
  operation: "replace";
  code: string;
};

export type WrapPatch = PatchMatch & {
  operation: "wrap";
  before: string;
  after: string;
};

export type Patch = InsertBeforePatch | ReplacePatch | WrapPatch;
