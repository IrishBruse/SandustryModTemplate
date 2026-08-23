# Content machine example mod

## Goal

Add `src/content-machine-example/`: one small end-to-end factory loop — register an **input element**, an **output element**, a **custom structure** (with a mod sprite), and **machine logic** that turns the input into the output when material is processed on that structure.

## Why

[005-custom-element-example.md](005-custom-element-example.md) covers a single material. Real content mods chain registration, assets, building, and processing. Authors need one copy target that shows how elements, structures, and machines fit together before they add tech trees, signals, or worker code.

## Suggested loop (implementer picks the simplest working pattern)

1. **Input element** — powder or slushy material the player can paint in (same paint path as 005).
2. **Output element** — distinct colour/density; only created by the machine.
3. **Structure** — `structures.register` with `shape`, `render`, and `buildModes`; sprite via `sprites.loadFromMod` from `mod/`.
4. **Machine** — one of:
   - `structures.addProcessor` on the custom structure (preferred if a small interval callback is enough), or
   - `structures.recipes.register` for a built-in archetype (`shaker`, `planterBox`, `kineticPress`, etc.) if that is less code for the chosen behaviour.
5. **Sandbox access** — `player.buildings.unlockByType` (and/or `building.selectStructure`) so the example is testable without a full tech node.

Document which machine API was chosen and why in the README.

## Acceptance

- [ ] New folder `src/content-machine-example/` (`mod.ts`, `main.ts`, `mod/<sprite>`, `README.md`)
- [ ] Two `elements.register` calls with mod-scoped ids; resolve types through the API, not hard-coded numbers
- [ ] `structures.register` + `sprites.loadFromMod` for the machine graphic
- [ ] Working input → output conversion on the placed structure (processor or recipe)
- [ ] `i18n.register` for element and structure names
- [ ] README walkthrough: unlock → build → feed input → collect output; note dependency on [005](005-custom-element-example.md) for the paint-only slice
- [ ] Listed in [`docs/layout.md`](../layout.md) and [`AGENTS.md`](../../AGENTS.md) sample-mod table
- [ ] User-visible note in [`docs/Changelog.md`](../Changelog.md) when the example ships

## Origin

Gap after custom-element example; `structures.addProcessor` and recipe registration are documented in types/runtime-model but have no template mod.
