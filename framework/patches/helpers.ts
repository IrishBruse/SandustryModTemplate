import type {
  InsertBeforePatch,
  PatchFind,
  PatchRegexMatch,
  ReplacePatch,
  WrapPatch,
} from "types/framework/patch";

type FindPatchFields = Pick<PatchFind, "file" | "find" | "expectedMatches" | "atomicGroup">;
type RegexPatchFields = Pick<
  PatchRegexMatch,
  "file" | "regex" | "expectedMatches" | "atomicGroup"
>;

export function insertBefore(
  patch: FindPatchFields & { code: string },
): Omit<InsertBeforePatch, "id"> {
  return { ...patch, operation: "insertBefore" };
}

export function replace(
  patch: FindPatchFields & { code: string },
): Omit<ReplacePatch, "id"> {
  return { ...patch, operation: "replace" };
}

export function wrap(
  patch: FindPatchFields & { before: string; after: string },
): Omit<WrapPatch, "id"> {
  return { ...patch, operation: "wrap" };
}

export function insertBeforeRegex(
  patch: RegexPatchFields & { code: string },
): Omit<InsertBeforePatch, "id"> {
  return { ...patch, operation: "insertBefore" };
}
