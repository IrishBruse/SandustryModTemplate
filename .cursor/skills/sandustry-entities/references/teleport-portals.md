# Teleport zones and portals

## Teleport zones

**Persisted:** `store.world.teleportZones[]`

| Field                       | Type    | Notes                                           |
| --------------------------- | ------- | ----------------------------------------------- |
| `id`                        | string  | Unique. Bidirectional zones add `{id}_reverse`. |
| `prefabX`, `prefabY`        | number  | Source prefab anchor (cells).                   |
| `entryX`, `entryY`          | number  | Entry rect origin (cells).                      |
| `entryWidth`, `entryHeight` | number  | Entry hit box (cells).                          |
| `exitX`, `exitY`            | number  | Exit position (cells).                          |
| `cooldown`                  | number  | Ms between uses. Default 500.                   |
| `bidirectional`             | boolean | Spawns linked reverse zone.                     |
| `linkedZoneId`              | string? | Paired zone id.                                 |

**Cache:** `session.teleportZoneCache` - `get(cellX, cellY)` returns zone for any cell inside entry rect.
Rebuilt on add/remove.

## Engine API

`sandkit.engine.api.teleportZones` - state-first.

| Method                                         | Read? | Role                         |
| ---------------------------------------------- | ----- | ---------------------------- |
| `getAll(state)`                                | yes   | `store.world.teleportZones`. |
| `getById(state, id)`                           | yes   | One zone.                    |
| `getAtCell(state, cellX, cellY)`               | yes   | Cache lookup.                |
| `add` / `remove`                               | no    | Mutate store and cache.      |
| `teleportPlayerTo(state, cellX, cellY, opts?)` | no    | Move player, optional VFX.   |
| `spawnDefaultParticles`                        | no    | Entry/exit particles.        |

Prefab loader calls `add` for each `teleportZones` block in prefab data (offsets from prefab center).

## Portals

`sandkit.engine.api.portals.getMarkers(state)` - read-only list for map UI.

Returns `{ name, x, y }[]` in world pixels (`cell * cellSize`).
Empty when portal feature disabled or all portals used.
Names come from i18n `nameKey` on static portal table.

**Not the same as teleport zones.** Teleport zones are grid rects with entry/exit.
Portal markers are map waypoints.
