# Cells: types, elements, matter

Three layers overlap at each grid cell:

1. **Cell id** (`shared.sim.cellIds`) - empty, terrain, damaged ground, or element slot.
2. **Element type** - numeric handle when id is in the element range, see `ElementType` enum and mod registrations.
3. **Matter type** - physics category (Solid, Liquid, Gas, ...) on the element **definition**, not stored per cell directly.

Use `sandkit.api.world.isCellEmptyAtCell`, `isTerrainAtCell`, `elements.getTypeAtCell`, `elements.getMatterTypeAtCell`, `terrains.getTypeAtCell` in mod code. Full signatures: `docs/api/sandkit/api/namespaces/{world,elements,terrains}/`.

## `CellType` (terrain ids 1-30 in enum)

Built-in terrain kinds include Empty (0), Element (1), Dirt, fog variants (`Fog` 4, `FogJetpackBlock` 5, `FogWater` 6, `FogLava` 13), Stone, Ice (25), Obsidian, etc.

Live fog sample: cellId **4** (`Fog`) at (200, 1720). Live terrain sample: cellId **25** (`Ice`).

Mod terrains register into ids up to **1000** (`terrainType` table length 1001).

## `ElementType` (built-in 1-20)

Sand, Water, Gold, Lava, Petalium (18), etc. Mod elements extend via `elements.register`.

Live: `state.sandkit.mods.elements` has **31** registered ids (sample: `caulk`, `florin`, `liquidGold`).

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

Elements can move with velocity in `elementData`. `isFreeFallingAtCell`, `getVelocityAtCell`, `convertToParticleAtCellWhenIdle` - see `elements.md`.
