---
name: sandustry-player
description: "Use when working with vanilla player, inventory, items, grabber, camera, input, and placement session."
---

# Sandustry player

Live **player map** of Early Access **0.5.5**.
Screen clicks and HUD hotbar rows stay in **sandustry-ui**.
Structure recipes stay in **sandustry-factory**.
Host IPC stays in **sandustry-internals**.

Public mod calls: official HTML `.tmp/Sandkit - Sandustry Modding API.html` (`api.player`, `api.input`, `api.items`, `api.tools.grabber`, `api.camera`, `api.action`, `api.cooldown`, `api.building`).
Types: `node_modules/@sandustry-modding/types/src/sandkit/api/`.
Access: CDP `:9222` (`sandustry-mcp`).

## Probe

1. `list_pages` - title **Sandustry**.
2. `evaluate_script` with `waitForStableDom: false`. `sandkit` is ambient in script scope (not always `window.sandkit`). `__debug.state === sandkit.state`.
3. Read fields and **sync getters** only.
  Prefer **canonical** names from HTML, deprecated aliases still live on the object.
4. Done when API key lists and samples match the branch file (or the gap is logged in `references/gaps.md`).

Do not call mutators.
Do not call `__debug.moveCamera`, teleport helpers, save/load, or clipboard/color setters unless the user asked.

Details: [references/probe.md](references/probe.md).

## Read

Open **one** file that matches the branch.

| Branch                                                     | File                                               |
| ---------------------------------------------------------- | -------------------------------------------------- |
| Safe probe rules                                           | [references/probe.md](references/probe.md)         |
| `store.player`, `sandkit.api.player`, Pixi body tint       | [references/player.md](references/player.md)       |
| Hotbar, inventory, `sandkit.api.items`                     | [references/items.md](references/items.md)         |
| Grabber, `sandkit.api.tools.grabber`                       | [references/tools.md](references/tools.md)         |
| Placement mode, `session.building`, `session.construction` | [references/building.md](references/building.md)   |
| Keys, mouse, `sandkit.api.input`, live `KeyBinding`        | [references/input.md](references/input.md)         |
| `session.camera`, `sandkit.api.camera`                     | [references/camera.md](references/camera.md)       |
| `session.action`, `sandkit.api.action`                     | [references/action.md](references/action.md)       |
| Cooldown (`api.cooldown` in `player.md`)                   | [references/player.md](references/player.md)       |
| Coloring tool and palettes                                 | [references/coloring.md](references/coloring.md)   |
| Blueprint clipboard                                        | [references/clipboard.md](references/clipboard.md) |
| `session` bags for player work                             | [references/state.md](references/state.md)         |
| Enums (`BuildMode`, `ItemId`, ...)                         | [references/enums.md](references/enums.md)         |
| Not confirmed yet                                          | [references/gaps.md](references/gaps.md)           |
