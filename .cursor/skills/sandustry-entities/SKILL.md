---
name: sandustry-entities
description: "drones, entities, projectiles, creatures, swarm, sweeper, launchers, portals, teleport zones, world items. Use when probing live drones, entities, projectiles, creatures, or sandkit.engine.api.entities / drones."
---

# Sandustry entities

Live **entity map** of Early Access **0.5.2**. Public mod calls stay in https://sandustry-modding.github.io/SandustryTypes/#/. Screen clicks stay in **sandustry-ui**. Host bridge stays in **sandustry-internals**.

This skill covers **engine and store models** only. It does not cover Debug F3 spawn UI (see **sandustry-ui** `references/debug.md`).

## Probe (read-only)

1. `list_pages` - title **Sandustry**, `file://.../dist/index.html`.
2. `evaluate_script` on the game page. Use `waitForStableDom: false`.
3. State: `const s = sandkit.state` (same as `sandkit.engine.state`, `__debug.state`).
4. Done when counts and sample keys match the branch file.

**Do not call:** `engine.api.drones.spawn|kill`, `entities.spawn|launch|startCapture`, `teleportZones.teleportPlayerTo|add|remove`, `world.pickups.spawnAtWorld|destroy|pickUp`, `projectiles.spawnAtWorld|remove`, `swarmConsole.setSpawnJammed`, `sweeperDrone.cancelSelection`.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                         | File                                                             |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| Safe probe scripts                             | [references/probe.md](references/probe.md)                       |
| `store.*` arrays, session caches               | [references/store.md](references/store.md)                       |
| `engine.api.entities`, creatures, capture      | [references/entities.md](references/entities.md)                 |
| `store.drones`, hauler / sweeper               | [references/drones.md](references/drones.md)                     |
| `store.projectiles`, public API                | [references/projectiles.md](references/projectiles.md)           |
| `store.worldItems`, pickups, prefab cache      | [references/world-items.md](references/world-items.md)           |
| `teleportZones`, `portals`                     | [references/teleport-portals.md](references/teleport-portals.md) |
| `swarmConsole`, `sweeperDrone`                 | [references/swarm-sweeper.md](references/swarm-sweeper.md)       |
| `launchers.registerType`                       | [references/launchers.md](references/launchers.md)               |
| `DroneType`, `ProjectileType`, `WorldItemType` | [references/enums.md](references/enums.md)                       |
| Not confirmed yet                              | [references/gaps.md](references/gaps.md)                         |
