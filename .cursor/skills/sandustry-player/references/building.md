# Building mode

Placement **mode** and session flags - not structure catalogs (those are **sandustry-factory** / **sandustry-ui** `building.md`).

## `session.building`

| Field                 | Role                                             |
| --------------------- | ------------------------------------------------ |
| `activeStructureType` | Selected type id or `null`                       |
| `start`               | `{ x, y }` anchor cell for drag placement        |
| `placing`             | Preview/placement in progress                    |
| `amountOfTiles`       | Tile count for current drag                      |
| `lockedAngle`         | Locked rotation or `null`                        |
| `ignoreAngleLock`     | Skip angle lock (mod binding may override **B**) |

## `session.construction`

| Field              | Role                                    |
| ------------------ | --------------------------------------- |
| `marqueeActive`    | Area select mode (`KeyBinding.Marquee`) |
| `demolisherActive` | Demolish mode (`KeyBinding.Demolish`)   |
| `rulerActive`      | Ruler overlay (`KeyBinding.Ruler`)      |

## `sandkit.enums.BuildMode`

| Member        | Value |
| ------------- | ----- |
| `Linear`      | 1     |
| `Rectangular` | 2     |

Used by structure definitions for drag shape - not stored on `session.building` directly.

## `sandkit.api.building`

| Method                                   | Arity | Notes                                                      |
| ---------------------------------------- | ----- | ---------------------------------------------------------- |
| `getSnappedPositionAtCell(cellX, cellY)` | 2     | Snapped world `{ x, y }` pixels                            |
| `isBlockedAtCell(cellX, cellY)`          | 2     | Placement blocked                                          |
| `cancelPlacement()`                      | 0     | **mutate** - clear preview                                 |
| `selectStructure(typeOrId)`              | 1     | **mutate** - pick structure, returns resolved id or `null` |

`StructureType` enum: `docs/api/sandkit/api/namespaces/building/enumerations/StructureType.md`.

## Engine twin

`engine.api.building`: `getSnappedCellPosition(state, x, y)`, `isBlockedByTerrainOrElements(state, x, y)`, `cancelPlacement(state)`, `selectStructure(state, id)`.

## Cheat

`session.cheat.bypassCosts` - when `true`, placement ignores resource costs (Debug). Read-only unless user asks.
