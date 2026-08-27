# Wall, heat, shadows, foliage

Public mod API has **no** wall or heat namespaces. These are **engine-only** on `sandkit.engine.api` (state-first, arg0 = game state). List: **sandustry-internals** `references/engine.md`.

Do not call `setWallDataAt` or heat/foliage mutators during read-only probes.

## `shared.wallData` (live)

| Field             | Live                              |
| ----------------- | --------------------------------- |
| `data`            | `Uint8Array`, len 14745600 (3840) |
| `width`, `height` | 3840                              |
| `paletteData`     | len 1020                          |

Engine methods: `getWallDataAt`, `getWallDataSize`, `getPaletteData`, `setWallDataAt`.

Sample one byte: `wallData.data[cellY * width + cellX]`. Player cell probe: byte **0**.

## `shared.shadowMap` (live)

| Field             | Live               |
| ----------------- | ------------------ |
| `data`            | `Uint8Array`, 3840 |
| `width`, `height` | 3840               |

Engine: `shadows.refresh`, `refreshRadius`, `refreshRect`. Terrain ops honor `skipShadow` in terrains API.

`__debug.config.debug.overrideTerrainShadow` / `terrainShadowValue` - F3 debug flags, overlay UI in **sandustry-ui** `references/debug.md`.

## Heat transfer (engine only)

`heatTransfer`: `absorbAdjacentElements`, `addTemperature`, `computeDiffusedTemperatures`, `computeEqualizedTemperature`, `consumeTemperatureNear`, `ensureTemperature`, `equalizeConnected`.

No dedicated heat SAB on `shared.*` (only `wallData` matches a heat/temp name filter). Fire definition `getExtraProps().data.temperature` is **1000** (default, not a per-cell grid). Per-cell lifetime uses `elementData.durationLeft` / `durationMax`. Do not dump `elementData` arrays.

## Foliage (engine only)

`foliage`: `generate`, `getClusters`, `getContainer`, `hasProcgenData`.

Prefab placements and Pixi parallax sprites for void-world clears: `background-layers.md`.

## Matters (engine only)

`matters`: `getMatterTypeFromId`, `register`, `runSolidUpdate`. One live mod matter registration in `state.sandkit.mods.matters`.
