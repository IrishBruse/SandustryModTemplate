---
name: sandustry
description: "Use when a Sandustry mod or live fact needs grid, elements, terrains, structures, pipes, energy, signals, player, items, tech, HUD, pause, drones, engine, or workers. Official Sandkit HTML. Read one domain SKILL.md from this table."
---

# Sandustry facts

Vanilla game facts only (no mod-only behavior). Official signatures: `.tmp/Sandkit - Sandustry Modding API.html` or https://sandustry.com/sandkit.html. Types package is secondary. Live session: **sandustry-mcp**.

This skill does not load the domain files. After the branch is known, **Read** that path. Humans can also type `/sandustry-world` (and the other names).

## Pick

1. Match the task to **one** row.
2. Read that `SKILL.md`.
3. Open **one** reference file named in its table.
4. Done when the needed fact is in that file (or its `gaps.md`).

| Branch                                                                | Read                                            |
| --------------------------------------------------------------------- | ----------------------------------------------- |
| Live CDP attach, `evaluate_script`, click, void-world batches         | `.cursor/skills/sandustry-mcp/SKILL.md`         |
| grid, cells, elements, terrains, maps, fog, chunks, workers           | `.cursor/skills/sandustry-world/SKILL.md`       |
| structures, pipes, recipes, factory level, authorization, queue       | `.cursor/skills/sandustry-factory/SKILL.md`     |
| energy, signals, collector gold vs power                              | `.cursor/skills/sandustry-energy/SKILL.md`      |
| player, inventory, items, grabber, camera, input, building session    | `.cursor/skills/sandustry-player/SKILL.md`      |
| HUD, pause, Options, Toolbox, Research screen, overlays, hotkeys      | `.cursor/skills/sandustry-ui/SKILL.md`          |
| tech, upgrades, discoveries, conservatory, tutorial, objectives       | `.cursor/skills/sandustry-progression/SKILL.md` |
| drones, entities, projectiles, pickups, portals, swarm                | `.cursor/skills/sandustry-entities/SKILL.md`    |
| `sandkit.engine`, `__debug`, electron IPC, extract tree, worker entry | `.cursor/skills/sandustry-internals/SKILL.md`   |

Extracted game: `sandustry/<version>-mods/` after `npm run setup`.
