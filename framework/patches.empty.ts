import { definePatches } from "@framework/modinfo";

/** Browser-bundle stub — real patches load only when building `patches.json`. */
export const frameworkDebugPatches = definePatches([]);
