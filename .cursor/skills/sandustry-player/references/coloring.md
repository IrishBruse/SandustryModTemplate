# Coloring

Engine-only namespaces on `sandkit.engine.api`.
No public `sandkit.api` twin.

## `coloringTool`

| Method                                   | Role                                    |
| ---------------------------------------- | --------------------------------------- |
| `getColor(state)`                        | Structure color hex (default `#ff0000`) |
| `setColor(state, hex)`                   | **mutate**                              |
| `isPaintBucketMode(state)`               | Paint bucket on                         |
| `togglePaintBucketMode(state)`           | **mutate** - binding often **B**        |
| `isMatchColorMode(state)`                | Match-color mode                        |
| `toggleMatchColorMode(state)`            | **mutate**                              |
| `colorStructure(structure, cell, color)` | **mutate**                              |
| `floodFillColor(state, cell, color, …)`  | **mutate**                              |
| `isColorableStructure(structure)`        | Type can be painted                     |

## `colorPicker`

| Symbol / method                                              | Role                      |
| ------------------------------------------------------------ | ------------------------- |
| `NO_COLOR`                                                   | `null`                    |
| `RANDOM_COLOR`                                               | `"random"`                |
| `CYCLE_COLOR`                                                | `"cycle"`                 |
| `PREDEFINED_COLORS`                                          | 16 hex swatches           |
| `getActivePalette()`                                         | Open palette id or `null` |
| `setActivePalette(id)`                                       | **mutate**                |
| `togglePalette(state, id, slot?)`                            | **mutate**                |
| `closePalette(state, slot?)`                                 | **mutate**                |
| `hexToRgba` / `rgbaToHex`                                    | Color conversion          |
| `getRandomColor` / `getCycleColor`                           | Pick swatch               |
| `renderColorButton` / `renderPalette` / `renderColorSection` | UI helpers                |

## `foundationColorPicker`

| Method            | Role                                     |
| ----------------- | ---------------------------------------- |
| `getColor(state)` | Foundation tint (live default `#555555`) |

## `lightColorPicker`

| Method            | Role                                                         |
| ----------------- | ------------------------------------------------------------ |
| `getColor(state)` | Wall light RGBA array, random/cycle modes use picker helpers |

## Probe snippet (read-only)

```js
() => {
  const s = window.sandkit.state;
  const eng = window.sandkit.engine.api;
  return {
    paintBucket: eng.coloringTool.isPaintBucketMode(s),
    matchColor: eng.coloringTool.isMatchColorMode(s),
    palette: eng.colorPicker.getActivePalette(),
    foundation: eng.foundationColorPicker.getColor(s),
    light: eng.lightColorPicker.getColor(s),
  };
};
```
