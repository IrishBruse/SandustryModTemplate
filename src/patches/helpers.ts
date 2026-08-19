import type {
  InsertBeforePatch,
  PatchFind,
  PatchRegexMatch,
  ReplacePatch,
  WrapPatch,
} from "./types";

type FindPatchFields = Pick<PatchFind, "id" | "file" | "find" | "expectedMatches" | "atomicGroup">;
type RegexPatchFields = Pick<
  PatchRegexMatch,
  "id" | "file" | "regex" | "expectedMatches" | "atomicGroup"
>;

export function insertBefore(
  patch: FindPatchFields & { code: string },
): InsertBeforePatch {
  return { ...patch, operation: "insertBefore" };
}

export function replace(patch: FindPatchFields & { code: string }): ReplacePatch {
  return { ...patch, operation: "replace" };
}

export function wrap(
  patch: FindPatchFields & { before: string; after: string },
): WrapPatch {
  return { ...patch, operation: "wrap" };
}

export function insertBeforeRegex(
  patch: RegexPatchFields & { code: string },
): InsertBeforePatch {
  return { ...patch, operation: "insertBefore" };
}
