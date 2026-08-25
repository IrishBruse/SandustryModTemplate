# Gaps

Not confirmed in this pass:

- Full per-creature instance field list for each `typeId` (only common fields documented).
- Sweeper drone `type` string value and full `data` schema (save had zero drones).
- Digger drone `data` fields when `DroneType.Digger` is active.
- `entities.registerSpawner` callback signatures.
- `launchers.registerType` for base (non-mk2) launchers - only mk2 config probed live.
- Portal static table contents when markers are non-empty (live save returned `[]`).
- `prefabWorldItemCache` entry shape when cache is populated (save: `Fn` wrapper with `.cache` key only).
- Grappling-hook and fire projectile `attributes` schemas.
- Worker-thread copies of `store.projectiles` / `store.drones` (main thread only probed).
- Whether Debug F3 "Redweaver" / "Voltblub" map to `resinWeaver` / a removed type (only bundle string `voltblub:spark` found).

Live counts (2025-08 probe, no spawns): **169** projectiles (`type: 2`, full motion fields), **1** world item, **0** drones, **872** structures (signal + quantum portal types on belt).
