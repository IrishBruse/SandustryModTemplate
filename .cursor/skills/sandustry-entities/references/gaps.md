# Gaps

Still open (this save had **0** live entities, drones, projectiles, world items, teleport zones):

- Per-creature instance fields beyond the common set
- Sweeper / Digger drone `data` when those types are active
- `engine.api.entities.registerSpawner` callback signature
- `launchers.registerType` for base (non-mk2) launchers
- Portal static table when markers are non-empty
- `prefabWorldItemCache` populated entry shape
- Grappling-hook and fire projectile `attributes`
- Worker copies of `store.projectiles` / `store.drones`
- Debug F3 "Redweaver" / "Voltblub" vs `resinWeaver` / removed types
- Full `store.stratacores` id catalog (this save: `["terracortex"]` only)

Public `api.entities` has no `getAll()`: `entities.md`. `store.gloom.emitterPositions` was `[]`.
