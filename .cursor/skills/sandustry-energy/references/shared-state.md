# Shared state (energy-adjacent)

`__debug.state.shared` - worker-safe SABs. Do not dump full tile arrays (length **921600** on this map).

## Global pool

| Field          | Type (live)      | Role                                                               |
| -------------- | ---------------- | ------------------------------------------------------------------ |
| `energy`       | `Uint32Array(1)` | Global energy counter. Index `0` mirrors `store.resources.energy`. |
| `energyChange` | `Uint32Array(4)` | Worker -> main sync for energy updates.                            |

### `energyChange` layout

| Index | Role                                   |
| ----- | -------------------------------------- |
| `0`   | Last synced energy total.              |
| `1`   | Pending worker change count (Atomics). |
| `2`   | Source cell X (optional charge FX).    |
| `3`   | Source cell Y (optional charge FX).    |

Main thread writes `store.resources.energy` and refreshes HUD when `energy[0]` diverges from `energyChange[0]`.

## Per-tile flags

| Field                | Type (live)                 | Role                                                                                                                  |
| -------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `energyBatteryDirty` | `Uint8Array(tileW × tileH)` | Dirty flags for **goldBattery** structures. Values `0` idle, `1` dirty, `2` processing. Not a generic power-grid map. |

## Gold (economy, not power)

| Field                | Type (live)                 | Role                                                                                          |
| -------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| `gold`               | `Uint32Array(1)`            | Player **gold** currency (sell / shop). Mirrors `store.resources.gold`.                       |
| `goldChange`         | `Uint32Array(4)`            | Same 4-slot pattern as `energyChange` for worker gold pickup sync.                            |
| `collectorGoldCount` | `Uint8Array(tileW × tileH)` | Per-tile gold element count under **Collector** structures (max 255). Economy adjacency only. |

Gold and energy are separate currencies. **goldBattery** converts element gold in its footprint into global **energy** - see `gold-collector.md`.
