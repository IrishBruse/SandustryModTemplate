# Probe

Read-only inspection via `sandustry-mcp` `evaluate_script`. Return JSON only.

## Safe

- `sandkit.state.store` array lengths and first-item key lists.
- `sandkit.api.entities.getById`, `getAllByType` (no public `getAll`).
- `sandkit.engine.api.entities.getAll(state)`, `getAllByType`, `getAllTypeDefs`.
- `sandkit.engine.api.teleportZones.getAll|getAtCell|getById`.
- `sandkit.engine.api.portals.getMarkers(state)`.
- `sandkit.engine.api.swarmConsole` getters (`getCrystalMined`, `getRadiusPx`, `getDiskRadiusCells`, `getPlacedConsoles`, `isSpawnJammed`, `getPendingConvergence`, `getNearestConvergence`).
- `sandkit.api.projectiles.getAll()`, `getById`, `pickups.getAll()`, `getById`.
- `sandkit.enums.DroneType`, `ProjectileType`, `PickupType`.
- `store.stratacores`, `store.gloom.emitterPositions`.
- `Object.keys` on API bags. Round positions with `Math.round`.

## Unsafe (needs user ask)

- `api.entities.spawnAtWorld|remove|launch|startCapture|collect`.
- `engine.api.drones.spawn|kill`.
- `engine.api.entities.spawn|launch|startCapture|collectById|removeById|registerType|registerSpawner`.
- `engine.api.teleportZones.teleportPlayerTo|add|remove|spawnDefaultParticles`.
- `api.projectiles.spawnAtWorld|remove|register`.
- `api.pickups.spawnAtWorld|remove|pickUp|destroy`.
- `swarmConsole.setSpawnJammed|resetAllConvergenceBuffers|decrementConvergenceBuffer|registerEntityType`.
- `sweeperDrone.cancelSelection`.

## Quick dump

```js
() => {
  const s = sandkit.state;
  const eng = sandkit.engine.api;
  const pub = sandkit.api.entities;
  const typeIds = eng.entities.getAllTypeDefs(s).map((d) => d.typeId);
  const byType = Object.fromEntries(typeIds.map((id) => [id, pub.getAllByType(id).length]));
  return {
    version: s.store.version,
    counts: {
      drones: s.store.drones.length,
      projectiles: s.store.projectiles.length,
      worldItems: s.store.worldItems.length,
      entities: eng.entities.getAll(s).length,
      stratacores: s.store.stratacores?.length ?? 0,
      gloomEmitters: s.store.gloom?.emitterPositions?.length ?? 0,
    },
    entityCountByType: byType,
    creatureTypes: Object.keys(s.store.creatures || {}),
    entityTypeIds: typeIds,
    stratacores: s.store.stratacores,
    teleportZones: s.store.world.teleportZones?.length ?? 0,
  };
};
```

## Sample one instance

```js
() => {
  const s = sandkit.state;
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
    drone: pick(s.store.drones),
    projectile: pick(s.store.projectiles),
    worldItem: pick(s.store.worldItems),
    entity: pick(sandkit.engine.api.entities.getAll(s)),
  };
};
```
