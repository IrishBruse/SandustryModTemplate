# Probe

Read-only inspection via `sandustry-mcp` `evaluate_script`. Return JSON-serializable data only.

`sandkit` is ambient in the evaluate scope. It is not on `window`. `window.__debug.state === sandkit.state`.

## Safe

- `Object.keys` on `sandkit.api.structures`, `.processing`, `.structureBehaviors`, `.authorization`, `.building`, `.collector`.
- `sandkit.api.structures.getAtCell`, `getDefinitionByType`, `getAvailableTypes`, `isLockedByType`, `isTypeAtCell`, `hasBuiltAtCell`, `forEachOfType` (read callbacks only).
- `sandkit.api.structures.processing.isEnabledAtCell`.
- `sandkit.api.authorization.canBuildAtCell`, `canGrabAtCell`, `getZoneIdAtCell`, `getPlayerZoneId`.
- `sandkit.engine.api.factory.getLevel`, `getProcessCount`, `getProcessRate`, `canUnlockNextTier` (pass `sandkit.state` first).
- Store counts and first-item key lists: `store.structures`, `store.pipes`, `store.pumpsCache`, `store.queue`, `store.viability`, `store.stratacores`, `store.factoryLevelCap`.
- `session.building`, `session.construction`, `session.factoryProcessRates`, `session.cache.structures`, `session.cache.pipes`.
- `state.sandkit.mods.structures` keys (definition objects). `state.sandkit.registeredLauncherTypes`.
- `shared.authorization` - report `{ width, height }` and sparse zone samples. Do not dump `data`.
- `sandkit.enums.StructureType`, `BuildingClearance`, `AuthorizationType`.

## Unsafe (needs user ask)

- `structures.buildAtCell`, `removeAtCell`, `removeBetweenCells`, `removeAtCells`.
- `structures.updateData`, `update`, `setSpritesheetIndex*`, `structures.processing.setEnabledAtCell`, `structures.processing.register`, `structures.register`.
- `processing.registerGrower|registerShaker|registerKineticPress`, `structureBehaviors.register*`, `structures.recipes.register`.
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
    structures: st.structures.length,
    queued: st.structures.filter((x) => x.queued).length,
    pipes: st.pipes.length,
    pumpsCache: st.pumpsCache.length,
    viability: st.viability,
    factoryLevel: sandkit.engine.api.factory.getLevel(s),
    apiStructures: Object.keys(sandkit.api.structures).filter(
      (k) => typeof sandkit.api.structures[k] === "function",
    ),
  };
};
```
