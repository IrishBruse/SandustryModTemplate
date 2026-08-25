# Discoveries

Public API: `sandkit.api.discoveries`. **Main thread only.**

| Method                          | Role                                                                 |
| ------------------------------- | -------------------------------------------------------------------- |
| `addElementByType(elementType)` | Append numeric `ElementType` to `store.discoveries.elements` if new. |
| `addTerrainByType(terrainType)` | Append numeric terrain type to `store.discoveries.terrains` if new.  |

## Store

```ts
store.discoveries: {
  elements: number[],
  terrains: number[]
}
```

New saves seed starter lists (sand, gold, stone, ...). Live probe on a mid-game save: 65 elements, 5 terrains.

Research unlock and world events also call internal `discoveries.addElement` / `addTerrain`.

## UI session

`session.ui.discoveryPopups` is an array of pending popup payloads. Length 0 when idle.

Discovery log screen is under Research in **sandustry-ui**. Lexicon overlaps discovery content, see `lexicon.md`.
