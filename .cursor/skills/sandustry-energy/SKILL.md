---
name: sandustry-energy
description: "Use when working with vanilla energy networks, signals, collector, and resource energy helpers."
---

# Sandustry energy and signals

Live **power and signal map** for Early Access **0.5.5**. Mod calls use `sandkit.api.*`. Host-only runtime uses `sandkit.engine.api` - see **sandustry-internals**.

Official API: `.tmp/Sandkit - Sandustry Modding API.html` (`api.energy`, `api.signals`, `api.resources`, `api.collector`). Types: `node_modules/@sandustry-modding/types/src/sandkit/api/energy.d.ts`, `node_modules/@sandustry-modding/types/src/sandkit/api/signals.d.ts`. Heat transfer is **sandustry-world**; only touch it when energy mechanics tie in.

## Probe

1. `list_pages` - title **Sandustry**.
2. `evaluate_script` with `waitForStableDom: false`. Read `sandkit.api` getters and `__debug.state`. Check `typeof window.sandkit`.
3. Done when live keys match the branch file, or the named SAB lengths match.

Do not call `sandkit.api.energy.addAtCell`, `consume`, `signals.setOutputAtCell`, signal `link` / `set`, or clipboard `set` / `activate` unless the user asked.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                        | File                                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| Safe MCP reads                                | [references/probe.md](references/probe.md)                   |
| `sandkit.api.energy`                          | [references/api-energy.md](references/api-energy.md)         |
| `sandkit.api.signals`                         | [references/api-signals.md](references/api-signals.md)       |
| `sandkit.api.resources` energy helpers        | [references/api-resources.md](references/api-resources.md)   |
| `state.shared` energy / gold SABs             | [references/shared-state.md](references/shared-state.md)     |
| `state.sandkit.mods.energy` registry          | [references/engine-energy.md](references/engine-energy.md)   |
| Signal runtime (`session.mods.signals`)       | [references/engine-signals.md](references/engine-signals.md) |
| Clipboard / blueprint signal links            | [references/clipboard.md](references/clipboard.md)           |
| Gold economy vs power, collector, goldBattery | [references/gold-collector.md](references/gold-collector.md) |
| HUD Energy row                                | **sandustry-ui** `references/hud.md`                         |
| Not confirmed yet                             | [references/gaps.md](references/gaps.md)                     |
