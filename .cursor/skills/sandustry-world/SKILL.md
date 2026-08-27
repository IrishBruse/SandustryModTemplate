---
name: sandustry-world
description: "Sandustry world sim, cells, chunks, elements, matter, grid, terrains, fog, wall heat, workers. Use when probing live world/grid/elements/matter/terrains or sandkit.api.grid / elements / pickups."
---

# Sandustry world

Live **world map** of Early Access **0.5.5**. Public API: [sandkit.html](https://sandustry.com/sandkit.html) (source of truth for signatures). Types: `@sandustry-modding/types` 0.3.x. Screen clicks stay in **sandustry-ui**. Host IPC and `__debug` stay in **sandustry-internals**.

## Probe

1. **sandustry-mcp** attach, then `evaluate_script` with `waitForStableDom: false`.
2. `sandkit.api` is ambient in the renderer when the game is loaded; `__debug.state` is the vanilla read bag (`__debug.state === sandkit.state`).
3. Read **one cell** or a **coarse stride** sample. Do not dump `cellIds`, `wallData.data`, or `shadowMap.data`.
4. Done when live keys match the reference for that branch (or the gap is logged in `references/gaps.md`).

Do not invoke: `engine.api.game.*`, `__debug.admin.run`, `setWallDataAt`, save/load IPC, spawn/kill, `grid.excavateAtCell`, `grid.mutate`, `revealFogAtCell`, `reportActivityAtCell`, `redrawAroundCell`, element/terrain `createAtCell` / `replaceAtCell` / `removeAtCell`, `pickups.spawnAtWorld`.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                     | File                                                               |
| ------------------------------------------ | ------------------------------------------------------------------ |
| Read-only probe rules                      | [references/probe.md](references/probe.md)                         |
| Grid size, cell id ranges, chunks          | [references/grid-chunks.md](references/grid-chunks.md)             |
| CellType vs element vs matter              | [references/cells.md](references/cells.md)                         |
| `api.grid`, `api.world` alias, `pickups`   | [references/world-api.md](references/world-api.md)                 |
| `api.elements` (main vs worker)            | [references/elements.md](references/elements.md)                   |
| `api.terrains`                             | [references/terrains.md](references/terrains.md)                   |
| Grid iteration helpers                     | [references/grid-api.md](references/grid-api.md)                   |
| `api.maps`                                 | [references/maps.md](references/maps.md)                           |
| Reactions, excavation, fire, patterns      | [references/sim-crafting.md](references/sim-crafting.md)           |
| `store.world`, horizon, fixtures           | [references/store-world.md](references/store-world.md)             |
| Wall, heat, shadows, foliage (engine)      | [references/wall-heat-foliage.md](references/wall-heat-foliage.md) |
| Background rasters, prefabs, Pixi parallax | [references/background-layers.md](references/background-layers.md) |
| Workers, scheduling, chunk flags           | [references/workers.md](references/workers.md)                     |
| idStats, overflowPool, water zones         | [references/sim-stats.md](references/sim-stats.md)                 |
| Not confirmed yet                          | [references/gaps.md](references/gaps.md)                           |
