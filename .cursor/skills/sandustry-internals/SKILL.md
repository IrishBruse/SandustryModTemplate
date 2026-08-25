---
name: sandustry-internals
description: "Sandustry host internals: window.electron IPC, sandkit.engine, sandkit.state, __debug, debugF3, extracted sandustry/ main and preload, workshop-mods limits. Use when probing live APIs outside public sandkit.api, Electron bridge, file patches, or workers."
---

# Sandustry internals

Live **host map** of Early Access **0.5.2** (this session: Steam, Linux, Electron 33.2.1, `apiVersion` 1). Public mod calls stay in `docs/api/sandkit/`. Screen clicks stay in **sandustry-ui**.

Extracted tree: repo `sandustry/` (`npm run setup`). Do not treat generated `docs/api/engine/` as complete, confirm on the live object.

## Probe

1. `list_pages` - title **Sandustry**.
2. `evaluate_script` with `waitForStableDom: false`. Return JSON only.
3. Read keys and call **sync getters** only (`getPlatformSync`, `getSystemInfo`, `isFilePatchingActiveSync`).
4. Done when the named object's keys (or this skill's matching reference) are in the latest script result.

Do not invoke: `appQuit`, `openDevTools`, `save` / `load` / `deleteSave`, `saveSettings`, `setFullscreen`, workshop subscribe/unsubscribe/download, achievement unlock/clear, `engine.api.game.*`, `__debug.admin.run`, `__debug.setSchedulingMode`.

## Read

Open **one** file that matches the branch.

| Branch | File |
| ------ | ---- |
| How to inspect without writes | [references/probe.md](references/probe.md) |
| `window` aliases, webpack, Noise | [references/globals.md](references/globals.md) |
| `window.electron` and IPC channels | [references/electron.md](references/electron.md) |
| `sandkit.engine.api` extras vs public | [references/engine.md](references/engine.md) |
| `sandkit.state` bags | [references/state.md](references/state.md) |
| `__debug`, `debugF3` | [references/debug.md](references/debug.md) |
| Extracted `sandustry/` tree | [references/sandustry.md](references/sandustry.md) |
| `workshop-mods.js` limits | [references/mods-host.md](references/mods-host.md) |
| Not confirmed yet | [references/gaps.md](references/gaps.md) |
