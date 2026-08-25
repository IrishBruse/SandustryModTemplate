---
name: sandustry-factory
description: "structures, recipes, processing, pipes, conveyors, factory viability, build queue, authorization. Use when probing live factory, structures, recipes, processing, conveyors, or sandkit.api.structures / processing."
---

# Sandustry factory

Live **simulation map** for structures, machines, pipes, conveyors, factory tiers, and build authorization. Early Access **0.5.2**.

Public mod calls: `modkit/types/sandkit/api/structures.d.ts`, `processing.d.ts`, `structureBehaviors.d.ts`, `authorization.d.ts`. Screen structure lists: **sandustry-ui** `references/building.md`. Placement session flags: **sandustry-player** `references/building.md`.

## Probe

1. `list_pages` - title **Sandustry**.
2. `evaluate_script` with `waitForStableDom: false`. `sandkit` is ambient in the script scope (not `window.sandkit`). `__debug.state === sandkit.state`.
3. Done when API key lists and store samples match the branch file.

Do not call: `structures.buildAtCellWhenIdle`, `remove*WhenIdle`, `structures.processing.setEnabledAt`, `building.selectStructure` / `cancelPlacement`, `engine.api.factory.unlockNextTier` / `addViabilityGold` / `recordProcess`, `engine.api.queue.process`, `engine.api.conveyors.registerType`, `__debug.ensureQueuedStructuresAreBuilt`.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                                    | File                                                       |
| --------------------------------------------------------- | ---------------------------------------------------------- |
| Safe MCP reads                                            | [references/probe.md](references/probe.md)                 |
| `store.structures`, `sandkit.api.structures`, mod defs    | [references/structures.md](references/structures.md)       |
| Recipes, grower / shaker / press, `structures.processing` | [references/processing.md](references/processing.md)       |
| `store.pipes`, `pumpsCache`, fluids placement             | [references/pipes.md](references/pipes.md)                 |
| Viability, `factoryLevelCap`, `engine.api.factory`        | [references/factory.md](references/factory.md)             |
| Conveyors, launchers, `structureBehaviors`                | [references/conveyors.md](references/conveyors.md)         |
| Authorization grid, `canBuildAtCell`                      | [references/authorization.md](references/authorization.md) |
| `store.queue`, `structure.queued`                         | [references/queue.md](references/queue.md)                 |
| `StructureType`, `BuildingClearance`, `AuthorizationType` | [references/enums.md](references/enums.md)                 |
| Not confirmed yet                                         | [references/gaps.md](references/gaps.md)                   |
