---
name: sandustry-internals
description: "Use when working with host electron IPC, sandkit.engine, __debug, extract tree, and worker-entry API."
---

# Sandustry internals

Live **host map** of Early Access **0.5.5**. Public mod calls: repo `.tmp/Sandkit - Sandustry Modding API.html` (`apiVersion` **1**); types at [SandustryTypes](https://sandustry-modding.github.io/SandustryTypes/#/). Screen clicks stay in **sandustry-ui**.

Extracted tree: `sandustry/source/` (`npm run setup`). Do not treat the published type reference as complete; confirm on the live object.

**0.5.5 notes:** `sandkit` keys - `api`, `apiVersion`, `engine`, `enums`, `react`, `state`. Official HTML documents `api.grid`; live **`api.world`** is a **deprecated alias** (same `mutate`, plus `pickups`, `runWhenSimulationIdle`, `redrawAroundCellWhenIdle`). **`api.game.start({ skipIntro? })`** is official but a mutator - document only in probes. `store.gloom.emitterPositions`, `store.createdVersion`, `store.machineryEngine.runLaunchers`.

## Probe

1. Read keys and call **sync getters** only (`getPlatformSync`, `getSystemInfo`, `isFilePatchingActiveSync`).
2. Done when the named object's keys (or this skill's matching reference) match the live object.

Do not invoke: `appQuit`, `save` / `load` / `deleteSave`, `saveSettings`, `setFullscreen`, workshop subscribe/unsubscribe/download, achievement unlock/clear, `engine.api.game.*`, `__debug.admin.run`, `__debug.setSchedulingMode`.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                        | File                                                 |
| --------------------------------------------- | ---------------------------------------------------- |
| How to inspect without writes                 | [references/probe.md](references/probe.md)           |
| `window` aliases, webpack, Noise              | [references/globals.md](references/globals.md)       |
| `window.electron` and IPC channels            | [references/electron.md](references/electron.md)     |
| `sandkit.engine.api` extras vs public         | [references/engine.md](references/engine.md)         |
| Official worker `sandkit.api` vs engine arity | [references/worker-api.md](references/worker-api.md) |
| `sandkit.state` bags                          | [references/state.md](references/state.md)           |
| `__debug`                                     | [references/debug.md](references/debug.md)           |
| Extracted `sandustry/` tree                   | [references/sandustry.md](references/sandustry.md)   |
| Loader / **Starting game** / save layout      | [references/boot.md](references/boot.md)             |
| `workshop-mods.js` limits                     | [references/mods-host.md](references/mods-host.md)   |
| Not confirmed yet                             | [references/gaps.md](references/gaps.md)             |
