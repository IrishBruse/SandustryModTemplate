import type { Patch } from "./types";
import { debugPatches } from "../debug/patches";

export type { Patch } from "./types";
export { insertBefore, replace, wrap } from "./helpers";

/** Sandustry bundle patches — compiled to patches.json at build time. */
export const patches: Patch[] = __MOD_DEBUG__ ? [...debugPatches] : [];
