---
name: sandustry-entities
description: "Use when working with vanilla drones, entities, projectiles, pickups, portals, and swarm."
---

# Sandustry entities

Live **entity map** of Early Access **0.5.5**. Public mod calls: https://sandustry.com/sandkit.html (`api.entities`, `api.projectiles`, `api.pickups`). Screen clicks stay in **sandustry-ui**. Host bridge stays in **sandustry-internals**.

Public `sandkit.api.entities` first, then engine and store models. Debug F3 spawn UI: **sandustry-ui** `references/debug.md`.

## Probe (read-only)

1. `list_pages` - title **Sandustry**, `file://.../dist/index.html`.
2. `evaluate_script` on the game page. Use `waitForStableDom: false`.
3. State: `const s = sandkit.state` (same as `sandkit.engine.state`, `__debug.state`).
4. Done when counts and sample keys match the branch file.

**Do not call:** `api.entities.spawnAtWorld|remove|launch|startCapture|collect`, `engine.api.drones.spawn|kill`, `engine.api.entities.spawn|launch|startCapture|registerType|registerSpawner`, `teleportZones.teleportPlayerTo|add|remove`, `api.pickups.spawnAtWorld|remove|pickUp|destroy`, `api.projectiles.spawnAtWorld|remove`, `swarmConsole.setSpawnJammed`, `sweeperDrone.cancelSelection`.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                      | File                                                             |
| ------------------------------------------- | ---------------------------------------------------------------- |
| Safe probe scripts                          | [references/probe.md](references/probe.md)                       |
| `store.*` arrays, session caches            | [references/store.md](references/store.md)                       |
| `api.entities`, creatures, capture          | [references/entities.md](references/entities.md)                 |
| `store.drones`, hauler / sweeper            | [references/drones.md](references/drones.md)                     |
| `store.projectiles`, public API             | [references/projectiles.md](references/projectiles.md)           |
| `store.worldItems`, pickups, prefab cache   | [references/world-items.md](references/world-items.md)           |
| `teleportZones`, `portals`                  | [references/teleport-portals.md](references/teleport-portals.md) |
| `swarmConsole`, `sweeperDrone`              | [references/swarm-sweeper.md](references/swarm-sweeper.md)       |
| `launchers.registerType`                    | [references/launchers.md](references/launchers.md)               |
| `DroneType`, `ProjectileType`, `PickupType` | [references/enums.md](references/enums.md)                       |
| Not confirmed yet                           | [references/gaps.md](references/gaps.md)                         |
