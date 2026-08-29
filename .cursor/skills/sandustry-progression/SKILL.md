---
name: sandustry-progression
description: "Use when working with vanilla tech, upgrades, discoveries, conservatory, tutorial, and objectives."
---

# Sandustry progression

Early Access **0.5.5** ids and store fields for tech, upgrades, discoveries, viability, conservatory, tutorial, lexicon, and objectives. Screen clicks stay in **sandustry-ui**. Factory tier reads and process ids: **sandustry-factory** (`api.factory` + `engine.api.factory`).

Official API: `.tmp/Sandkit - Sandustry Modding API.html`. Types: `node_modules/@sandustry-modding/types/src/sandkit/api/`.

## Probe

1. Read [references/probe.md](references/probe.md). Use `sandustry-mcp` `evaluate_script` or DevTools. Return JSON only.
2. Prefer `sandkit.api.*` getters. Read `sandkit.state.store` and `sandkit.state.session` fields. Do not call mutators unless the user asks.
3. Done when the named keys or sample values match the live object.

Do not: click Research nodes, **MAX EVERYTHING**, buy tech, spend tickets, or call `progression.complete` / `discoveries.add*` / `tech.setLockedById` / `factory.unlockNextTier` during probes.

## Read

Open **one** file that matches the branch.

| Branch                                                           | File                                                     |
| ---------------------------------------------------------------- | -------------------------------------------------------- |
| Safe read-only probes                                            | [references/probe.md](references/probe.md)               |
| `sandkit.api.tech`, `store.lockedTechs`, `player.tech`           | [references/tech.md](references/tech.md)                 |
| `sandkit.api.upgrades`, `store.upgrades`                         | [references/upgrades.md](references/upgrades.md)         |
| `sandkit.api.discoveries`, `store.discoveries`, discovery popups | [references/discoveries.md](references/discoveries.md)   |
| `sandkit.api.progression`, `store.progression`                   | [references/progression.md](references/progression.md)   |
| `store.viability`, `productionPoints`, factory tier (read)       | [references/viability.md](references/viability.md)       |
| Conservatory tickets, creatures, reward tech ids                 | [references/conservatory.md](references/conservatory.md) |
| `store.tutorial`, tutorial steps                                 | [references/tutorial.md](references/tutorial.md)         |
| `store.objectives`, objective ids                                | [references/objectives.md](references/objectives.md)     |
| `session.lexicon`, lexicon window                                | [references/lexicon.md](references/lexicon.md)           |
| `sandkit.enums.Tech`, `TechStatus`                               | [references/enums.md](references/enums.md)               |
| `store` progression bag summary                                  | [references/store.md](references/store.md)               |
| Not confirmed yet                                                | [references/gaps.md](references/gaps.md)                 |
