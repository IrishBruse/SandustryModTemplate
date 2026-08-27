# Background layers

Visual background is **not** only `shared.sim.cellIds`. Void-world wipes must clear these too. Scripts: **sandustry-mcp** `references/void-world.md`.

## Simulation buffers (3840×3840)

| Buffer             | Path                    | Bytes per cell | Role                  |
| ------------------ | ----------------------- | -------------- | --------------------- |
| Terrain / elements | `shared.sim.cellIds`    | 4 (uint32)     | Foreground sim        |
| Wall tiles         | `shared.wallData.data`  | 1              | Background wall paint |
| Terrain shadow     | `shared.shadowMap.data` | 1              | Shadow overlay        |
| Map raster         | `shared.mapData.data`   | 4 (RGBA)       | Procgen map imagery   |

Clear per row batch (see void-world phase 2). Do not dump full arrays in probe responses.

## World metadata

| Field           | Path                        | Role                               |
| --------------- | --------------------------- | ---------------------------------- |
| Horizon columns | `store.world.horizon`       | len 3840, ground silhouette height |
| Ground horizon  | `store.world.groundHorizon` | len 3840                           |
| Fixtures        | `store.world.fixtures`      | World fixture list                 |
| Lights          | `store.world.lights`        | World light records                |
| Teleport zones  | `store.world.teleportZones` | Zone defs                          |
| Sensors         | `store.world.sensors`       | Sensor defs                        |

`.fill(0)` on horizons; `.length = 0` on arrays.

## Prefab decor

| Field                      | Path                                       |
| -------------------------- | ------------------------------------------ |
| Placements                 | `store.mods.prefabData.placements`         |
| Foliage copy               | `store.mods.foliage.data.prefabPlacements` |
| **Placed sprites (store)** | `store.mods.foliage.placedFoliage`         |
| Procgen clusters           | `store.mods.foliage.data.procgenClusters`  |
| Foliage clusters           | `engine.api.foliage.getClusters(state)`    |
| Foliage Pixi container     | `engine.api.foliage.getContainer(state)`   |

Clear **all** placement arrays, `placedFoliage`, and `removeChildren()` on foliage container. Prefab arrays can be empty while `placedFoliage` still holds live sprite records (Void save: **2015** entries, same count as Pixi children).

## Pixi (`session.rendering.pixi`)

Parallax and map overlay sprites — hide (`visible: false`, `alpha: 0`) and clear children:

| Key                                | Role                               |
| ---------------------------------- | ---------------------------------- |
| `mountainsSprite`                  | Distant mountains                  |
| `treesSmallSprite`                 | Small trees parallax               |
| `treesSprite`                      | Trees parallax                     |
| `bgL04Sprite`                      | Background layer 4                 |
| `bgL04Extension`                   | Layer 4 extension                  |
| `backgroundEntitiesContainer`      | Decor entities (~28 children live) |
| `mapSprite`                        | Map / fog overlay texture          |
| `wallTilemap` / `shadowMapTilemap` | Wall and shadow tilemaps           |

Also set `filter.uniformGroup.uniforms.uDrawUndergroundFog = false` when present.

Large foliage draw container may live on `pixi.app.stage` (hundreds of children) — hide that container if decor respawns after redraw.

## Fog uncover vs buffers

- **Fog cells** in sim: terrain ids `4`, `5`, `6`, `13` (`CellType.Fog*`).
- **`revealFogAtCell`** updates exploration and may spawn cached world items (**sandustry-entities** `references/world-items.md`).
- After direct buffer clear, fog ids are already `0`; batched `revealFogAtCell` still helps the **map UI** if black fog remains.

## Related

- Wall / shadow engine API: `references/wall-heat-foliage.md`
- `store.world` keys: `references/store-world.md`
- Void batch scripts: **sandustry-mcp** `references/void-world.md`
