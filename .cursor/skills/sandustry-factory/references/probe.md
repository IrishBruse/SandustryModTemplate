# Probe

Read-only inspection via `sandustry-mcp` `evaluate_script`.
Return JSON-serializable data only.

`sandkit` is ambient in the evaluate scope.
Check `typeof window.sandkit`. `__debug.state === sandkit.state`.

## Safe

- `Object.keys` on `sandkit.api.structures`, `.structureBehaviors`, `.authorization`, `.building`, `.collector`, `.factory`, `.pipes`, `.blueprints`.
- `sandkit.api.structures.getAtCell`, `getDefinitionByType`, `getAvailableTypes`, `isLockedByType`, `isTypeAtCell`, `hasBuiltAtCell`, `forEachOfType` (read callbacks only).
- `sandkit.api.structures.processing.isEnabledAtCell`.
- `sandkit.api.factory.getLevel`, `getProcessCount(processId)`, `getProcessRate(processId)` - `processId` required for count/rate.
- `sandkit.api.pipes.isAtCell`, `isEnabledAtCell`, `getConnectedVentsAtCell`.
- `sandkit.api.blueprints.serializeStructures`, `localizeStructures` on existing `store.structures` slices (read-only).
- `sandkit.api.authorization.canBuildAtCell`, `canGrabAtCell`, `getZoneIdAtCell`, `getPlayerZoneId`.
- `sandkit.engine.api.factory.getLevel`, `getProcessCount`, `getProcessRate`, `canUnlockNextTier` (pass `sandkit.state` first) - internal fallback.
- Store counts and first-item key lists: `store.structures`, `store.pipes`, `store.pumpsCache`, `store.queue`, `store.viability`, `store.stratacores`, `store.factoryLevelCap`.
- `session.building`, `session.construction`, `session.factoryProcessRates`, `session.cache.structures`, `session.cache.pipes`.
- `state.sandkit.mods.structures` keys (definition objects). `state.sandkit.registeredLauncherTypes`.
- `shared.authorization` - report `{ width, height }` and sparse zone samples.
  Do not dump `data`.
- `sandkit.enums.StructureType`, `BuildingClearance`, `AuthorizationType`.

## Unsafe (needs user ask)

- `structures.buildAtCell`, `removeAtCell`, `removeBetweenCells`, `removeAtCells` (and `*WhenIdle` aliases).
- `structures.updateData`, `update`, `setSpritesheetIndex*`, `structures.processing.setEnabledAtCell` (and `setEnabledAt` alias).
- `pipes.setEnabledAtCell`.
- `structureBehaviors.register*`, `structures.recipes.register`, `structures.processing.register`.
- `building.selectStructure`, `cancelPlacement`.
- `engine.api.structures.build|removeAt|removeBetween|removeAtPositions`.
- `engine.api.factory.addViabilityGold`, `unlockNextTier`, `recordProcess`, `ensureProcessAtLeast`, `flushDeferredLevelUps`.
- `engine.api.queue.enqueue*`, `process`, `registerHandler`, `removeByKey`.
- `engine.api.conveyors.registerType`, `engine.api.launchers.registerType`.
- `__debug.ensureQueuedStructuresAreBuilt`.

## Quick dump

```js
() => {
  const s = sandkit.state;
  const st = s.store;
  const pick = (arr) =>
    arr[0]
      ? Object.fromEntries(
          Object.entries(arr[0]).map(([k, v]) => [
            k,
            v && typeof v === "object" && !Array.isArray(v) ? Object.keys(v) : v,
          ]),
        )
      : null;
  return {
    version: __debug?.config?.version,
    structures: st.structures.length,
    queued: st.structures.filter((x) => x.queued).length,
    pipes: st.pipes.length,
    pumpsCache: st.pumpsCache.length,
    viability: st.viability,
    factoryLevel: sandkit.api.factory.getLevel(),
    processCounts: {
      shakeWetSand: sandkit.api.factory.getProcessCount("shakeWetSand"),
      pressBurntResidue: sandkit.api.factory.getProcessCount("pressBurntResidue"),
      growFlowers: sandkit.api.factory.getProcessCount("growFlowers"),
      condenseFlorin: sandkit.api.factory.getProcessCount("condenseFlorin"),
    },
    apiFactory: Object.keys(sandkit.api.factory).filter(
      (k) => typeof sandkit.api.factory[k] === "function",
    ),
    apiPipes: Object.keys(sandkit.api.pipes).filter(
      (k) => typeof sandkit.api.pipes[k] === "function",
    ),
    apiStructures: Object.keys(sandkit.api.structures).filter(
      (k) => typeof sandkit.api.structures[k] === "function",
    ),
  };
};
```
