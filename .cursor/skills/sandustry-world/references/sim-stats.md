# Sim stats buffers

Read-only layout for `shared.sim.idStats`, `shared.sim.overflowPool`, and `shared.waterPresenceZones`. Confirmed on live **0.5.2** (3840×3840 grid, `elementCapacity` 1 000 000).

## `shared.sim.idStats`

`Uint32Array`, length **`Nl(elementCapacity) + 120`** (live: **220**).

| Constant      | Value                | Source                                         |
| ------------- | -------------------- | ---------------------------------------------- |
| `Nl(cap)`     | `ceil(cap / 10 000)` | Slab count for element pools                   |
| Worker blocks | **24** × **5** stats | Debug Stats worker timeline (`se.J$`, `se.vT`) |

### Slab header (indices `0 … Nl-1`)

One uint32 per 10 000 element-capacity slab. Live sample: mostly `14` at idle; also `0`, terrain/element ids, and `4294967295` (`UINT32_MAX`) for unused slots.

### Per-worker block (indices `Nl + workerIndex * 5`)

Five counters written at end of worker tick:

| Offset | Role (bundle)                             |
| ------ | ----------------------------------------- |
| `+0`   | Queue length                              |
| `+1`   | Alloc counter                             |
| `+2`   | Alloc rate input (Stats tab derives `/s`) |
| `+3`   | Recycle counter                           |
| `+4`   | `max(0, tickSpan - idleSpan + 1)`         |

Probe one block only: `idStats[Nl + workerIndex * 5 + off]` for `workerIndex` 0–23.

## `shared.sim.overflowPool`

`Uint32Array`, length **100 001**.

| Index | Role                                          |
| ----- | --------------------------------------------- |
| `0`   | Atomic stack pointer (number of pooled ids)   |
| `1…`  | Pooled element ids popped when slabs are full |

Live idle save: index `0` is `0`; tail slots are `0`. Do not mutate; workers use `Atomics.load` / `compareExchange`.

## `shared.waterPresenceZones`

Coarse water-activity raster for ambience (flow sound pan/volume), not per-cell water sim.

| Field                      | Live                        | Role                                                         |
| -------------------------- | --------------------------- | ------------------------------------------------------------ |
| `waterPresenceZones`       | `Uint8Array` len **14 400** | `0` = dry zone, non-zero (usually `1`) = water seen recently |
| `waterPresenceZonesWidth`  | **120**                     | Zone columns                                                 |
| `waterPresenceZonesHeight` | **120**                     | Zone rows                                                    |

Zone size in cells: `floor(worldWidth / zoneWidth)` → **32** cells/edge on 3840-wide maps.

Zone index: `zoneY * waterPresenceZonesWidth + zoneX` where  
`zoneX = floor(cellX / 32)`, `zoneY = floor(cellY / 32)`.

Writers set `Atomics.store(zones, index, 1)` on water activity (~1% sample rate in bundle). Readers scan a radius around the player for nearest wet zone.

MCP note: indexed access may appear as numeric keys on the typed array; prefer `zones[index]` or `Atomics.load`, not `Object.keys` dumps.

## Related

- Grid size and cell ids: `grid-chunks.md`
- Worker scheduling: `workers.md`
- Debug Stats tab UI: **sandustry-ui** `references/debug.md`
