import type { GeneratedSandkitApi } from "./generated";
import type { RefinedSandkitApi } from "./refined";

/** Namespaces replaced by hand-refined typings in refined.d.ts */
type RefinedKeys = keyof RefinedSandkitApi;

/**
 * Full Sandkit API: runtime dump coverage (`generated.d.ts`) with refined
 * typings for mod-heavy namespaces (`refined.d.ts`).
 *
 * ## Legacy name migration (Workshop → runtime)
 *
 * | Old / Workshop pattern | Runtime name |
 * |---|---|
 * | `canBuildAtCell(x, y)` | `canBuild(ctx, x, y)` |
 * | `getWorldPosition()` | `getPosition(ctx)` |
 * | `forEachCellInCircle(...)` | `iterateCircle(ctx, ...)` |
 * | `registerBinding(...)` | `registerKeyBinding(...)` |
 * | `createAtCellWhenIdle(...)` | `createAt(ctx, ...)` or idle helpers |
 * | `isCellEmptyAtCell(...)` | `isCellEmpty(ctx, ...)` |
 * | `loadFromMod(...)` | `sprites.load(ctx, ...)` |
 * | `api.gameConfig.get` | `api.config` |
 * | `api.ui.inject` | `api.ui.overlays.register` (inject may be absent) |
 * | `api.main.emitEvent` | `api.workers.emitToMain` |
 *
 * Regenerate dump stubs: `npm run generate-types`
 */
export type SandkitApi = Omit<GeneratedSandkitApi, RefinedKeys> & RefinedSandkitApi;

export type { GeneratedSandkitApi, RefinedSandkitApi };
