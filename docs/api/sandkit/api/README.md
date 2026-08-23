# sandkit/api

Main-thread `sandkit.api` barrel.

Re-exports all namespaces available as `sandkit.api.*` on the main thread.
Prefer these methods over [sandkit.engine](api/sandkit/README.md#engine-1) when both exist.

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [action](api/sandkit/api/namespaces/action/README.md) | `sandkit.api.action` — active hotbar action and custom handler data. Main thread only. |
| [assets](api/sandkit/api/namespaces/assets/README.md) | `sandkit.api.assets` — mod asset URLs and asset provider selection. Main thread only. |
| [authorization](api/sandkit/api/namespaces/authorization/README.md) | `sandkit.api.authorization` — player permission checks for build, grab, and tools. Main thread only. |
| [building](api/sandkit/api/namespaces/building/README.md) | `sandkit.api.building` — structure placement and built-in structure types. Main thread only. |
| [camera](api/sandkit/api/namespaces/camera/README.md) | `sandkit.api.camera` — camera focus and follow control. Main thread only. |
| [collector](api/sandkit/api/namespaces/collector/README.md) | `sandkit.api.collector` — collector structure value and pickup handling. Main thread only. |
| [constants](api/sandkit/api/namespaces/constants/README.md) | - |
| [cooldown](api/sandkit/api/namespaces/cooldown/README.md) | `sandkit.api.cooldown` — reusable cooldown timers for abilities and items. Main thread only. |
| [discoveries](api/sandkit/api/namespaces/discoveries/README.md) | `sandkit.api.discoveries` — unlock element and terrain entries in the discovery log. Main thread only. |
| [effects](api/sandkit/api/namespaces/effects/README.md) | `sandkit.api.effects` — visual effects, particles, lights, and lasers at world positions. Main thread only. |
| [elements](api/sandkit/api/namespaces/elements/README.md) | `sandkit.api.elements` — register elements and read or change cells when idle. Main thread only. |
| [energy](api/sandkit/api/namespaces/energy/README.md) | `sandkit.api.energy` — structure energy networks, storage, and consumption. Main thread only. |
| [events](api/sandkit/api/namespaces/events/README.md) | `sandkit.api.events` — subscribe to and emit named game events. Main thread only. |
| [excavation](api/sandkit/api/namespaces/excavation/README.md) | `sandkit.api.excavation` — register custom excavation tool dig profiles. Main thread only. |
| [fire](api/sandkit/api/namespaces/fire/README.md) | `sandkit.api.fire` — ignite and burn elements at grid cells. Main thread only. |
| [gameConfig](api/sandkit/api/namespaces/gameConfig/README.md) | `sandkit.api.gameConfig` — read merged game configuration values. Main thread only. |
| [grid](api/sandkit/api/namespaces/grid/README.md) | `sandkit.api.grid` — iterate cells in rectangular and circular regions. Main thread only. |
| [hooks](api/sandkit/api/namespaces/hooks/README.md) | `sandkit.api.hooks` — intercept and modify internal game hook points. Main thread only. |
| [i18n](api/sandkit/api/namespaces/i18n/README.md) | `sandkit.api.i18n` — translations, locales, and display strings for mods. Main thread only. |
| [input](api/sandkit/api/namespaces/input/README.md) | `sandkit.api.input` — key bindings, mouse position, and modifier keys. Main thread only. |
| [items](api/sandkit/api/namespaces/items/README.md) | `sandkit.api.items` — register custom inventory items and query active items. Main thread only. |
| [lights](api/sandkit/api/namespaces/lights/README.md) | `sandkit.api.lights` — temporary VFX lights and persistent world lights. Main thread only. |
| [maps](api/sandkit/api/namespaces/maps/README.md) | - |
| [mods](api/sandkit/api/namespaces/mods/README.md) | - |
| [patterns](api/sandkit/api/namespaces/patterns/README.md) | - |
| [player](api/sandkit/api/namespaces/player/README.md) | - |
| [processing](api/sandkit/api/namespaces/processing/README.md) | - |
| [progression](api/sandkit/api/namespaces/progression/README.md) | - |
| [projectiles](api/sandkit/api/namespaces/projectiles/README.md) | - |
| [random](api/sandkit/api/namespaces/random/README.md) | - |
| [raycast](api/sandkit/api/namespaces/raycast/README.md) | - |
| [reactions](api/sandkit/api/namespaces/reactions/README.md) | - |
| [rendering](api/sandkit/api/namespaces/rendering/README.md) | - |
| [resources](api/sandkit/api/namespaces/resources/README.md) | - |
| [scene](api/sandkit/api/namespaces/scene/README.md) | - |
| [schedule](api/sandkit/api/namespaces/schedule/README.md) | - |
| [settings](api/sandkit/api/namespaces/settings/README.md) | - |
| [shared](api/sandkit/api/namespaces/shared/README.md) | - |
| [signals](api/sandkit/api/namespaces/signals/README.md) | - |
| [sound](api/sandkit/api/namespaces/sound/README.md) | - |
| [sprites](api/sandkit/api/namespaces/sprites/README.md) | - |
| [storage](api/sandkit/api/namespaces/storage/README.md) | - |
| [structureBehaviors](api/sandkit/api/namespaces/structureBehaviors/README.md) | - |
| [structures](api/sandkit/api/namespaces/structures/README.md) | - |
| [tech](api/sandkit/api/namespaces/tech/README.md) | - |
| [terrains](api/sandkit/api/namespaces/terrains/README.md) | - |
| [time](api/sandkit/api/namespaces/time/README.md) | - |
| [tools](api/sandkit/api/namespaces/tools/README.md) | - |
| [triggers](api/sandkit/api/namespaces/triggers/README.md) | - |
| [ui](api/sandkit/api/namespaces/ui/README.md) | - |
| [upgrades](api/sandkit/api/namespaces/upgrades/README.md) | - |
| [utils](api/sandkit/api/namespaces/utils/README.md) | - |
| [workers](api/sandkit/api/namespaces/workers/README.md) | - |
| [world](api/sandkit/api/namespaces/world/README.md) | - |

## References

### SandkitApi

Re-exports [SandkitApi](api/sandkit/README.md#sandkitapi)
