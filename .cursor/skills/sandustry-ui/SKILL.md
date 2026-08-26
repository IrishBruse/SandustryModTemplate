---
name: sandustry-ui
description: "Sandustry live HUD, pause, Options, Save/Load, Toolbox, Building, Research, Upgrades, Debug, hotkeys, ComponentId inject. Use when searching or clicking the game UI, writing overlays, or using sandustry-mcp / chrome-devtools."
---

# Sandustry UI

Live **screen map** of the Electron renderer (Early Access **0.5.2**, English). Kit _components_ are not this skill: read [`docs/ui/overview.md`](../../../docs/ui/overview.md).

Capture: **sandustry-mcp** (attach + click rules). Labels drift, re-snapshot before click. Uids die after each DOM change.

## MCP

Screen map and panel labels below. Attach, probe, and triage: **sandustry-mcp**.

Pause **Continue / Save / Load / Options / Exit** are `div.cursor-pointer` — click the row whose `innerText` matches. If `press_key` is swallowed, `keydown` on `window` (`Tab`, `KeyQ`, `KeyT`, `KeyU`, `KeyM`, `Escape`) or click **Menu [Esc]**. Click **Load**, **Delete**, **Submit**, **MAX EVERYTHING**, **Unstuck**, or **Exit** only when the user asked.

Done when the target label is in the latest snapshot (or the script dump of that panel).

## Read

Open **one** file that matches the branch. Do not load the rest.

| Branch                                                               | File                                                   |
| -------------------------------------------------------------------- | ------------------------------------------------------ |
| `#canvas` / `#ui` layers, z-index, scenes                            | [references/dom.md](references/dom.md)                 |
| Resources, management column, hotbar, objectives, shortcuts, heatmap | [references/hud.md](references/hud.md)                 |
| Esc pause rows, Discord, seed, Mods inspector                        | [references/pause.md](references/pause.md)             |
| Options General / Video / Audio / Mods schema                        | [references/options.md](references/options.md)         |
| Save Game / Load Game dialogs                                        | [references/save-load.md](references/save-load.md)     |
| Send feedback / F2                                                   | [references/feedback.md](references/feedback.md)       |
| Shared Tab/Q/T/U overlay chrome                                      | [references/management.md](references/management.md)   |
| Toolbox items and Stratacores                                        | [references/toolbox.md](references/toolbox.md)         |
| Building structures and blueprints                                   | [references/building.md](references/building.md)       |
| Research tech tree and Conservatory                                  | [references/research.md](references/research.md)       |
| Upgrades cards                                                       | [references/upgrades.md](references/upgrades.md)       |
| Debug F3 tabs (spawn, cheats, sim)                                   | [references/debug.md](references/debug.md)             |
| Default keybindings                                                  | [references/bindings.md](references/bindings.md)       |
| `inject`, overlays, ComponentId -> screen                            | [references/overlay-api.md](references/overlay-api.md) |
| `@modkit/ui` pointers                                                | [references/kit.md](references/kit.md)                 |
| Screens not walked yet                                               | [references/gaps.md](references/gaps.md)               |
