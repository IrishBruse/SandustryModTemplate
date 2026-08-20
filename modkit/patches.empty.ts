import { definePatches } from "@modkit/modinfo";

/** Browser-bundle stub — real patches load only when building `patches.json`. */
export const modkitDebugPatches = definePatches([]);
