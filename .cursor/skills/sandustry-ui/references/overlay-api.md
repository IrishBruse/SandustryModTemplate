# Overlay API

Declarations: `node_modules/@sandustry-modding/types/sandkit/api/ui.d.ts`. Reference: https://sandustry-modding.github.io/SandustryTypes/#/.

## Calls

`inject`, `update`, `overlays.register(slot, overlayId, render)` (slot e.g. `"hotbar"`), `unregister`, `overlays.update`, `toast`, `showTooltip`, `alert`, `confirm`, `prompt`, `openPauseMenu`. Navigation: `useFocusable`, `useFocusScope`, `controllerFocusClass`. Engine: `sandkit.engine.api.debug`.

## inject

`inject(id, Component)` registers a **global** overlay. The overlay id is `${modId}:${id}` (the `sandkit` for that mod supplies `modId`). Engine store: `session.ui.overlays.global[overlayId] = { render }`. The same slot+id **replaces** `render` and calls `ui.update(GlobalOverlays)`.

The dispose function holds a Symbol token. A later `inject` with the same id writes a new token. The old dispose then does nothing.

`overlays.register("hotbar", overlayId, render)` writes `session.ui.overlays.hotbar[overlayId]` and updates **HotbarOverlays**. Same replace-by-id rule.

## ComponentId -> screen

| Id                    | Screen                         |
| --------------------- | ------------------------------ |
| Hotbar 1              | Bottom hotbar                  |
| SoundBoxConfig 2      | Structure config               |
| Root 4                | UI root                        |
| Menu 5                | [pause.md](pause.md)           |
| Management 6          | [management.md](management.md) |
| FilterConfig 7        | Filter UI                      |
| Resources 8           | Top-left resources             |
| TechTree 9            | [research.md](research.md)     |
| Tutorial 10           | Tutorial                       |
| Loader 11             | Loading                        |
| Options 12            | [options.md](options.md)       |
| ShortcutHelper 13     | HUD shortcuts                  |
| Upgrades 14           | [upgrades.md](upgrades.md)     |
| Tooltip 15            | Tooltips                       |
| Notifications 16      | Top-center                     |
| Objectives 17         | Top-right objectives           |
| DroneAdminList 18     | Drones                         |
| HotbarOverlays 19     | Extra hotbar chrome            |
| IntroScreen 20        | Intro                          |
| StoryNotifications 21 | Story toasts                   |
| FactoryProgress 22    | Viability                      |
| Dialogs 23            | Modals                         |
| GlobalOverlays 24     | Full-screen overlays           |
| Lexicon 25            | Codex                          |
| ModsScreen 26         | Pause Mods                     |
| CustomMapsScreen 27   | Custom maps                    |
| CinematicPanel 28     | Cinematics                     |
| Feedback 29           | [feedback.md](feedback.md)     |

CDP: `.cursor/mcp.json` -> `chrome-devtools-mcp --browser-url=http://127.0.0.1:9222`. Launch: `npm run sandustry` / F5.
