import type { GeneratedSandkitApi } from "./generated";
import type { RefinedSandkitApi } from "./refined";

/** Namespaces replaced by hand-refined typings in refined/ */
type RefinedKeys = keyof RefinedSandkitApi;

/**
 * Full Sandkit API: runtime dump coverage (`generated/`) with refined
 * typings for mod-heavy namespaces (`refined/`).
 *
 * The runtime dump is mod-facing — ctx is bound internally. Method names match
 * what you call in `main.js` / `worker.js` (e.g. `canBuildAtCell`, not `canBuild`).
 *
 * Regenerate dump stubs: `npm run generate-types`
 */
export type SandkitApi = Omit<GeneratedSandkitApi, RefinedKeys> & RefinedSandkitApi;

export type { GeneratedSandkitApi, RefinedSandkitApi };
