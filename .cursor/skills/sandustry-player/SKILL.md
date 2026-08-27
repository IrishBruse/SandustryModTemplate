---
name: sandustry-player
description: "Sandustry player, inventory, tools, grabber, build mode, camera, input, action, coloring/clipboard. Use when probing live player, tools, grabber, building mode, camera, input, or sandkit.api.player / tools / building / input."
---

# Sandustry player

Live **player map** of Early Access **0.5.2**. Screen clicks and HUD hotbar rows stay in **sandustry-ui**. Structure recipes stay in **sandustry-factory**. Host IPC stays in **sandustry-internals**.

Access: `window.sandkit` on CDP `:9222` (`sandustry-mcp`). Public mod API: https://sandustry-modding.github.io/SandustryTypes/#/.

## Probe

1. `list_pages` - title **Sandustry**.
2. `evaluate_script` with `waitForStableDom: false`. Read fields and **sync getters** only.
3. Done when the named object keys match the live object (or this skill's matching reference).

Do not call mutators. Do not call `__debug.moveCamera`, teleport helpers, save/load, or clipboard/color setters unless the user asked.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                                     | File                                               |
| ---------------------------------------------------------- | -------------------------------------------------- |
| Safe probe rules                                           | [references/probe.md](references/probe.md)         |
| `store.player`, `sandkit.api.player`                       | [references/player.md](references/player.md)       |
| Hotbar, inventory, `sandkit.api.items`                     | [references/items.md](references/items.md)         |
| Grabber, `sandkit.api.tools.grabber`                       | [references/tools.md](references/tools.md)         |
| Placement mode, `session.building`, `session.construction` | [references/building.md](references/building.md)   |
| Keys, mouse, `sandkit.api.input`, live `KeyBinding`        | [references/input.md](references/input.md)         |
| `session.camera`, `sandkit.api.camera`                     | [references/camera.md](references/camera.md)       |
| `session.action`, `sandkit.api.action`                     | [references/action.md](references/action.md)       |
| Coloring tool and palettes                                 | [references/coloring.md](references/coloring.md)   |
| Blueprint clipboard                                        | [references/clipboard.md](references/clipboard.md) |
| `session` bags for player work                             | [references/state.md](references/state.md)         |
| Enums (`BuildMode`, `ItemId`, ...)                         | [references/enums.md](references/enums.md)         |
| Not confirmed yet                                          | [references/gaps.md](references/gaps.md)           |
