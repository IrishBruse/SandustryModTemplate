---
name: sandustry-world
description: "Sandustry world sim, cells, chunks, elements, matter, grid, terrains, fog, wall heat, workers. Use when probing live world/grid/elements/matter/terrains or sandkit.api.world / elements / grid."
---

# Sandustry world

Live **world map** of Early Access **0.5.2**. Public mod calls stay in `docs/api/sandkit/`. Screen clicks stay in **sandustry-ui**. Host IPC and `__debug` stay in **sandustry-internals**.

Types: `modkit/types/sandkit/api/{world,elements,grid,terrains,maps}.d.ts`. Enums: `modkit/types/sandkit/enums/index.d.ts`.

## Probe

1. **sandustry-mcp** attach, then `evaluate_script` with `waitForStableDom: false`.
2. Use `__debug.state` and `__debug.config`. `sandkit` is **not** on `window`; `__debug.state === sandkit.state`.
3. Read **one cell** or a **coarse stride** sample. Do not dump `cellIds`, `wallData.data`, or `shadowMap.data`.
4. Done when live keys match the reference for that branch (or the gap is logged in `references/gaps.md`).

Do not invoke: `engine.api.game.*`, `__debug.admin.run`, `setWallDataAt`, save/load IPC, spawn/kill, `excavateAtCell`, `*AtCellWhenIdle`, `revealFogAtCell`, `reportActivityAtCell`, terrain `createAtCell` / `replaceAtCell` / `removeAtCell`, `world.pickups.spawnAtWorld`.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                    | File                                                               |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Read-only probe rules                     | [references/probe.md](references/probe.md)                         |
| Grid size, cell id ranges, chunks         | [references/grid-chunks.md](references/grid-chunks.md)             |
| CellType vs element vs matter             | [references/cells.md](references/cells.md)                         |
| `sandkit.api.world`, fog, redraw, pickups | [references/world-api.md](references/world-api.md)                 |
| `sandkit.api.elements`                    | [references/elements.md](references/elements.md)                   |
| `sandkit.api.terrains`                    | [references/terrains.md](references/terrains.md)                   |
| `sandkit.api.grid`                        | [references/grid-api.md](references/grid-api.md)                   |
| `sandkit.api.maps`                        | [references/maps.md](references/maps.md)                           |
| `store.world`, horizon, fixtures          | [references/store-world.md](references/store-world.md)             |
| Wall, heat, shadows, foliage (engine)     | [references/wall-heat-foliage.md](references/wall-heat-foliage.md) |
| Workers, scheduling, chunk flags          | [references/workers.md](references/workers.md)                     |
| idStats, overflowPool, water zones        | [references/sim-stats.md](references/sim-stats.md)                 |
| Not confirmed yet                         | [references/gaps.md](references/gaps.md)                           |
