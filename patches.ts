import { definePatches } from "@framework/modinfo";
import { frameworkDebugPatches } from "@framework/patches";

/** Production patches — always written to `patches.json`. */
export const patches = definePatches([]);

/** Debug-only patches — included in dev / `--debug` builds only. */
export const debugPatches = definePatches([...frameworkDebugPatches]);
