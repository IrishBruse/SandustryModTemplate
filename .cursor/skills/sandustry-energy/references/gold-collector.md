# Gold, collector, and power overlap

## Two currencies

| Resource   | HUD / store              | Shared SAB         | Purpose                                                                |
| ---------- | ------------------------ | ------------------ | ---------------------------------------------------------------------- |
| **Energy** | `store.resources.energy` | `shared.energy[0]` | Power pool for buildings, siphon, costs with `currencyId: "energy"`.   |
| **Gold**   | `store.resources.gold`   | `shared.gold[0]`   | Economy currency (collectors, selling). Event `resources:goldChanged`. |

Gold is **not** electrical energy.
Only document gold when it feeds power (goldBattery) or shares worker-sync patterns.

## goldBattery (power storage)

Structure type `goldBattery`.
Registered as energy **storage** with `excludeFromNetwork: true` - it does not join conductor graphs.

- Counts **florinol** (and gold-element) tiles in its 44 footprint.
- Charges global energy via the same `shared.energy` path as other storage.
- Uses `shared.energyBatteryDirty` per tile for worker/main sync (`1` dirty, `2` locked while updating).
- Charge FX uses rate limit key `goldBattery:charge`.

## Collector (economy)

`sandkit.api.collector` - pickup value for gold-bearing cells. `shared.collectorGoldCount` is a per-tile density map for collector structures, not energy.

Tile **admission** (which elements may enter Collector tiles) is still Gold + liquidGold only in 0.5.5, even when `collectable.value` is set.
See **sandustry-factory** `references/collector.md`.

Only overlap with energy: both use multithreaded SAB sync patterns similar to `energyChange` / `goldChange`.

## Element gold

Element type **gold** in the world is distinct from `store.resources.gold`.
Collectors and batteries bridge elements -> currencies.
