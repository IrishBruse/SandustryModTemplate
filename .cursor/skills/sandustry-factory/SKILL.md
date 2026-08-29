---
name: sandustry-factory
description: "Use when working with vanilla structures, pipes, recipes, factory level, authorization, and build queue."
---

# Sandustry factory

Live **simulation map** for structures, machines, pipes, conveyors, factory tiers, and build authorization. Early Access **0.5.5**.

Public mod calls: official HTML `.tmp/Sandkit - Sandustry Modding API.html` (structures, pipes, factory, blueprints, structureBehaviors, authorization, building, processing/recipes). Types: `node_modules/@sandustry-modding/types/src/sandkit/api/`. Screen structure lists: **sandustry-ui** `references/building.md`. Placement session flags: **sandustry-player** `references/building.md`.

## Probe

1. `list_pages` - title **Sandustry**.
2. `evaluate_script` with `waitForStableDom: false`. `sandkit` is ambient in script scope. Check `typeof window.sandkit` (may be `"object"` or `"undefined"`). `__debug.state === sandkit.state`.
3. Done when API key lists and store samples match the branch file.

Do not call: `structures.buildAtCell`, `removeAtCell` / `removeBetweenCells` / `removeAtCells`, `structures.processing.setEnabledAtCell`, `pipes.setEnabledAtCell`, `building.selectStructure` / `cancelPlacement`, `engine.api.factory.unlockNextTier` / `addViabilityGold` / `recordProcess`, `engine.api.queue.process`, `engine.api.conveyors.registerType`, `__debug.ensureQueuedStructuresAreBuilt`.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                                    | File                                                       |
| --------------------------------------------------------- | ---------------------------------------------------------- |
| Safe MCP reads                                            | [references/probe.md](references/probe.md)                 |
| `store.structures`, `sandkit.api.structures`, mod defs    | [references/structures.md](references/structures.md)       |
| Collector tile admission vs `collectable.value`           | [references/collector.md](references/collector.md)         |
| Recipes, grower / shaker / press, `structures.processing` | [references/processing.md](references/processing.md)       |
| `store.pipes`, `api.pipes`, `pumpsCache`, fluids          | [references/pipes.md](references/pipes.md)                 |
| Viability, `api.factory`, `engine.api.factory`            | [references/factory.md](references/factory.md)             |
| Blueprint serialize / localize                            | [references/blueprints.md](references/blueprints.md)       |
| Conveyors, launchers, `structureBehaviors`                | [references/conveyors.md](references/conveyors.md)         |
| Authorization grid, `canBuildAtCell`                      | [references/authorization.md](references/authorization.md) |
| `store.queue`, `structure.queued`                         | [references/queue.md](references/queue.md)                 |
| `StructureType`, `BuildingClearance`, `AuthorizationType` | [references/enums.md](references/enums.md)                 |
| Not confirmed yet                                         | [references/gaps.md](references/gaps.md)                   |
