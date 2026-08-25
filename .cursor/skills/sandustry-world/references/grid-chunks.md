# Grid and chunks

## Config (live 0.5.2)

From `__debug.config` (read-only):

| Field                | Live value                     |
| -------------------- | ------------------------------ |
| `cellSize`           | 4 px per cell                  |
| `chunkSize`          | 40 cells                       |
| `useMultithreading`  | true                           |
| `obstacleBreakpoint` | 100 (terrain `materialId` cap) |

## `shared.sim` (live)

| Field                                        | Live (this session)         | Role                                        |
| -------------------------------------------- | --------------------------- | ------------------------------------------- |
| `width`, `height`                            | 3840 3840                   | Grid size in cells                          |
| `chunkSize`                                  | 40                          | Cells per chunk edge (matches config)       |
| `chunkWidth`, `chunkHeight`                  | 96 96                       | Chunk count (= grid / chunkSize)            |
| `cellIds`                                    | `Uint32Array`, len 14745600 | Packed id per cell                          |
| `chunkShouldUpdate`, `chunkShouldUpdateNext` | `Uint8Array`, len 9216      | Per-chunk sim dirty flags                   |
| `elementCapacity`                            | 1000000                     | Max element slots                           |
| `liveElementCount`                           | `Uint32Array[1]`            | Active elements (~1.210 in probe)           |
| `idStats`                                    | `Uint32Array`, len 220      | Slab + worker sim counters — `sim-stats.md` |
| `overflowPool`                               | `Uint32Array`, len 100001   | Element id overflow stack — `sim-stats.md`  |
| `terrainType`                                | `Uint8Array`, len 1001      | Lookup table for terrain ids 1-1000         |

Chunk index: `chunkY * chunkWidth + chunkX` where `chunkX = floor(cellX / chunkSize)`.

## Cell id encoding (live)

From extracted bundle constants, confirmed by decoding live `cellIds`:

| Range                   | Kind                                               |
| ----------------------- | -------------------------------------------------- |
| `0`                     | Empty                                              |
| `1`-`1000`              | Terrain (`CellType` / registered terrain)          |
| `1001`-`1 000 000`      | Damaged ground (hp in `sim.damagedGround`)         |
| `1 000 001`-`2 000 000` | Element slot (`elementIndex = cellId - 1 000 001`) |

Index: `i = cellY * width + cellX`. Read `cellIds[i]` only, never log the full array.

## Damaged ground

`sim.damagedGround.type[]` and `.hp[]` indexed by `cellId - 1001`.

Live sample: cellId 1512 -> type 2 (Dirt), hp 3.

## Element slabs

`sim.elementData` holds structure-of-arrays fields: `type`, `x`, `y`, `velocityX`, `velocityY`, `isFreeFalling`, `dataField1`-`4`, `durationLeft`, `skipPhysics`, etc.

Live sample: cellId 1001935 -> index 1934, element `type` 18 (Petalium).

## Related buffers (same width height)

| Buffer                  | Ctor         | Notes                         |
| ----------------------- | ------------ | ----------------------------- |
| `shared.wallData.data`  | `Uint8Array` | Wall tile byte per cell       |
| `shared.shadowMap.data` | `Uint8Array` | Terrain shadow value per cell |
| `shared.mapData.data`   | (typed)      | Map metadata raster           |

Do not dump these arrays. Sample one index or coarse stride only.
