# Management menu button API

## Goal

Expose a standard modkit helper so mods can add a row to the left management list (Toolbox / Building / Research / Upgrades) without copying DOM spacer + position sync from a consumer mod.

## Why

`sandustry-doom-mod` already mounts a `MenuButton` under Upgrades and plays the vanilla hover `blip` / click `click` sounds. That logic belongs in the template modkit so other mods can reuse it.

## Acceptance

- [x] Modkit API (for example `@modkit/ui` or `@modkit/sdk`) can register a management-row button: label, icon, hotkey badge, `onClick`
- [x] Hover and click use the same sound cues as the vanilla rows (`blip` / `click`)
- [x] The row stays aligned when the management column collapses or the UI scales
- [x] Debug (and any rows below) stay below the inserted button without overlap
- [x] Docs + preview or example in the template show how to use it
- [ ] Doom mod switches to the modkit API and drops the one-off mount helper

## Origin

Prototyped in `sandustry-doom-mod` (`src/ui/DoomOverlay.tsx` management spacer + `MenuButton` sounds).

## Done in template

`ManagementMenuButton` in `@modkit/ui` — see [docs/ui/management-menu-button.md](../docs/ui/management-menu-button.md).
