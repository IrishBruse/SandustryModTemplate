# Overlay API

Declarations: `node_modules/@sandustry-modding/types/sandkit/api/ui.d.ts`. Reference: https://sandustry-modding.github.io/SandustryTypes/#/ and `.tmp/Sandkit - Sandustry Modding API.html`.

## Calls

Dialogs: `toast`, `showTooltip`, `alert`, `confirm`, `prompt`, `select(options, opts?)`, `openPauseMenu`. Hooks: `useGameEvent`, `useRefresh(componentIds)`, `useScale()`. Mount: `inject`, `update`. Regions: `regions.mount`, `regions.setVisible`. Overrides: `overrides.register`. Hotbar: `hotbar.createBankSource`, `selectAction`, `getBankCount`, `getActiveBankIndex`, `getActiveSlotIndex`, `getSlotKeyLabel`, `useHotbar`. Components: `components.ActionSlot`, `components.Panel`, `components.Button`. Navigation: `navigation.useFocusable`, `navigation.useFocusScope`, `navigation.getControllerFocusClass` (deprecated alias: `controllerFocusClass`). Engine: `sandkit.engine.api.debug`.

## regions (preferred over overlays)

`regions.mount(regionId, mountId, options)` - `options.placement?`: `"raised"` | `"docked"` (`"docked"` sits on the hotbar; `"raised"` above panels such as Filter Config); `options.order?`; `options.render()`. Returns `mountHandle` with `update(options)` and `unmount()`.

Deprecated aliases: `overlays.register(slot, overlayId, render)`, `overlays.update(slot)`, `overlays.unregister(slot, overlayId)`.

`regions.setVisible(regionId, visible)` returns `visibilityHandle.restore()`.

## overrides

`overrides.register(componentId, wrapper)` - `wrapper(Original, props)`. Returns `overrideHandle.remove()`. Example componentId: `"resources"`.

## hotbar

`createBankSource({ bankOffset, minimumBankCount? })` - `isAvailable()`, `getBankIndex()`, `getSlotCount()`, `getAction(slotIndex)`, `activateSlot(slotIndex)`, `clearSlot(slotIndex)`, `dispose()`.

Also: `selectAction(action)`, `getBankCount()`, `getActiveBankIndex()`, `getActiveSlotIndex()`, `getSlotKeyLabel(bindingId)`, `useHotbar()` -> `{ bankCount, activeBankIndex, activeSlotIndex }`.

## select

`select(options, opts?)` - `options[].label`, `options[].value`; `opts.message?`, `opts.title?`, `opts.defaultValue?`, `opts.buttonLabel?`. Returns chosen `value` or `null`.

## inject

`inject(id, Component)` registers a **global** overlay. The overlay id is `${modId}:${id}` (the `sandkit` for that mod supplies `modId`). Engine store: `session.ui.overlays.global[overlayId] = { render }`. The same slot+id **replaces** `render` and calls `ui.update(GlobalOverlays)`.

The dispose function holds a Symbol token. A later `inject` with the same id writes a new token. The old dispose then does nothing.

`regions.mount("hotbar", mountId, { render })` (or deprecated `overlays.register("hotbar", overlayId, render)`) writes `session.ui.overlays.hotbar[overlayId]` and updates **HotbarOverlays**. Same replace-by-id rule.

## ComponentId -> screen

Live `sandkit.enums.ComponentId` keyCount **31** (0.5.5).

| Id                    | Screen               |
| --------------------- | -------------------- |
| Hotbar 1              | Bottom hotbar        |
| SoundBoxConfig 2      | Structure config     |
| Root 4                | UI root              |
| Menu 5                | `pause.md`           |
| Management 6          | `management.md`      |
| FilterConfig 7        | Filter UI            |
| Resources 8           | Top-left resources   |
| TechTree 9            | `research.md`        |
| Tutorial 10           | Tutorial             |
| Loader 11             | Loading              |
| Options 12            | `options.md`         |
| ShortcutHelper 13     | HUD shortcuts        |
| Upgrades 14           | `upgrades.md`        |
| Tooltip 15            | Tooltips             |
| Notifications 16      | Top-center           |
| Objectives 17         | Top-right objectives |
| DroneAdminList 18     | Drones               |
| HotbarOverlays 19     | Extra hotbar chrome  |
| IntroScreen 20        | Intro                |
| StoryNotifications 21 | Story toasts         |
| FactoryProgress 22    | Viability            |
| Dialogs 23            | Modals               |
| GlobalOverlays 24     | Full-screen overlays |
| Lexicon 25            | Codex                |
| ModsScreen 26         | Pause Mods           |
| CustomMapsScreen 27   | Custom maps          |
| CinematicPanel 28     | Cinematics           |
| Feedback 29           | `feedback.md`        |
| MainMenuActions 30    | Main menu actions    |
| HudTopLeft 31         | `hud.md` top-left    |
| HudTopRight 32        | `hud.md` top-right   |

CDP: `.cursor/mcp.json` -> `chrome-devtools-mcp --browser-url=http://127.0.0.1:9222`. Launch: `npm run sandustry` / F5.
