# Management menu button API

## Goal

Expose a standard framework helper so mods can add a row to the left management list (Toolbox / Building / Research / Upgrades) without copying DOM spacer + position sync from a consumer mod.

## Why

`sandustry-doom-mod` already mounts a `MenuButton` under Upgrades and plays the vanilla hover `blip` / click `click` sounds. That logic belongs in the template framework so other mods can reuse it.

## Acceptance

- [ ] Framework API (for example `@framework/ui` or `@framework/sdk`) can register a management-row button: label, icon, hotkey badge, `onClick`
- [ ] Hover and click use the same sound cues as the vanilla rows (`blip` / `click`)
- [ ] The row stays aligned when the management column collapses or the UI scales
- [ ] Debug (and any rows below) stay below the inserted button without overlap
- [ ] Docs + preview or example in the template show how to use it
- [ ] Doom mod switches to the framework API and drops the one-off mount helper

## Origin

Prototyped in `sandustry-doom-mod` (`src/ui/DoomOverlay.tsx` management spacer + `MenuButton` sounds).
