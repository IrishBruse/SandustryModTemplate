# Cells: types, elements, matter

Three layers overlap at each grid cell:

1. **Cell id** (`shared.sim.cellIds`) - empty, terrain, damaged ground, or element slot.
2. **Element type** - numeric handle when id is in the element range, see `ElementType` enum and mod registrations.
3. **Matter type** - physics category (Solid, Liquid, Gas, ...) on the element **definition**, not stored per cell directly.

Use `api.grid.isCellEmptyAtCell`, `isTerrainAtCell`, `elements.getTypeAtCell`, `elements.getMatterTypeAtCell`, `terrains.getTypeAtCell` in mod code. Official: [sandkit.html](https://sandustry.com/sandkit.html).

## `CellType` (terrain ids 1-30 in enum)

Built-in terrain kinds include Empty (0), Element (1), Dirt, fog variants (`Fog` 4, `FogJetpackBlock` 5, `FogWater` 6, `FogLava` 13), Stone, Ice (25), Obsidian, etc.

Live fog sample: cellId **4** (`Fog`) at (200, 1720). Live terrain sample: cellId **25** (`Ice`).

Mod terrains register into ids up to **1000** (`terrainType` table length 1001).

## `ElementType` (built-in 1-20)

Sand (1), Water (3), Gold (7), **Gloom (8)**, Lava (19), Petalium (18), Basalt (20), etc. Mod elements extend via `elements.register`.

Live: `state.sandkit.mods.elements` has **31** registered ids (sample: `caulk`, `florin`, `liquidGold`).

## `PickupType` (world items)

Artifact (1), GlyphKey (2), **Stratacore (3)**, Orb (4). Deprecated enum alias: `WorldItemType`.

## `MatterType`

| Value | Name     |
| ----- | -------- |
| 1     | Solid    |
| 2     | Liquid   |
| 3     | Particle |
| 4     | Gas      |
| 5     | Static   |
| 6     | Slushy   |
| 7     | Wisp     |
| 8     | Powder   |

Resolve through `elements.getMatterTypeAtCell` or definition `matterType`. Engine-only `matters.register` / `getMatterTypeFromId`: **sandustry-internals** `references/engine.md`.

## Resolved vs raw type

- `getTypeAtCell` - raw stored type.
- `getResolvedTypeAtCell` / `getResolvedTypeFromCellId` - after overlays and particles.
- `getInfoAtCell` - `{ elementType, isParticle, cellId, elementIndex }`.

## Particles

Elements can move with velocity in `elementData`. `isFreeFallingAtCell`, `getVelocityAtCell`, `convertToParticleAtCell` - see `elements.md`.
