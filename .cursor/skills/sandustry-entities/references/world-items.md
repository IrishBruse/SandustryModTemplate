# World items

## Store model

`store.worldItems` - pickups in the world.

| Field    | Type   | Notes                                |
| -------- | ------ | ------------------------------------ |
| `id`     | number | Runtime id.                          |
| `type`   | number | `sandkit.enums.WorldItemType`.       |
| `x`, `y` | number | World pixels.                        |
| `data`   | object | Per-type animation and display data. |

### `data` by type

| WorldItemType | Value | data keys (typical)                         |
| ------------- | ----- | ------------------------------------------- |
| Artifact      | 1     | `name`, `hoverData` (bob), `prefabSpecial`  |
| GlyphKey      | 2     | Same hover pattern as Artifact.             |
| Stratacore    | 3     | `circleData` (orbit animation).             |
| Orb           | 4     | `breathData` (scale pulse), `lightPosition` |

Optional `data.lightIndex` when spawned with a point light.

## Public API

`sandkit.api.world.pickups`:

| Method                                    | Role                             |
| ----------------------------------------- | -------------------------------- |
| `getAll()`                                | `store.worldItems`.              |
| `getById(id)`                             | Find by id.                      |
| `spawnAtWorld(type, x, y, data?, light?)` | Spawn (unsafe).                  |
| `destroy(worldItem)`                      | Remove (unsafe).                 |
| `pickUp(worldItem)`                       | Collect into inventory (unsafe). |

Types: `node_modules/@sandustry-modding/types/sandkit/api/world.d.ts`. Reference: https://sandustry-modding.github.io/SandustryTypes/#/.

## `session.prefabWorldItemCache`

Grid map (`Fn`) populated at map load from prefab metadata:

- `worldItemOffset` cells -> Artifact or GlyphKey with translated name and optional light preset.
- `worldItems[]` and `artifact` blocks -> Artifact entries.
- Skips prefab name `"Void"`. Glyph Room prefabs use GlyphKey type.

When fog reveals a cell, cache entry spawns a real `store.worldItems` item and deletes the cache key. Probe: `session.prefabWorldItemCache` constructor name `Fn`; may have no numeric `size`.

## Sensors

Artifact sensors in `session.mainSensorCache` can also spawn Artifact pickups on fog reveal (separate from prefab cache).
