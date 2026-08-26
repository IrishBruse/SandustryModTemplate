---
name: sandustry-internals
description: "Sandustry host internals: window.electron IPC, sandkit.engine, sandkit.state, __debug, extracted sandustry/ main and preload, workshop-mods limits. Use when probing live APIs outside public sandkit.api, Electron bridge, file patches, or workers."
---

# Sandustry internals

Live **host map** of Early Access **0.5.2**. Public mod calls stay in `docs/api/sandkit/`. Screen clicks stay in **sandustry-ui**.

Extracted tree: repo `sandustry/<version>-<branch>/` (`npm run setup`). Do not treat generated `docs/api/engine/` as complete; confirm on the live object.

## Probe

1. Read keys and call **sync getters** only (`getPlatformSync`, `getSystemInfo`, `isFilePatchingActiveSync`).
2. Done when the named object's keys (or this skill's matching reference) match the live object.

Do not invoke: `appQuit`, `save` / `load` / `deleteSave`, `saveSettings`, `setFullscreen`, workshop subscribe/unsubscribe/download, achievement unlock/clear, `engine.api.game.*`, `__debug.admin.run`, `__debug.setSchedulingMode`.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                | File                                               |
| ------------------------------------- | -------------------------------------------------- |
| How to inspect without writes         | [references/probe.md](references/probe.md)         |
| `window` aliases, webpack, Noise      | [references/globals.md](references/globals.md)     |
| `window.electron` and IPC channels    | [references/electron.md](references/electron.md)   |
| `sandkit.engine.api` extras vs public | [references/engine.md](references/engine.md)       |
| `sandkit.state` bags                  | [references/state.md](references/state.md)         |
| `__debug`                             | [references/debug.md](references/debug.md)         |
| Extracted `sandustry/` tree           | [references/sandustry.md](references/sandustry.md) |
| `workshop-mods.js` limits             | [references/mods-host.md](references/mods-host.md) |
| Not confirmed yet                     | [references/gaps.md](references/gaps.md)           |
