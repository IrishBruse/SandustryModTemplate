# `sandkit.api.grid`

Main thread only. Cell iteration helpers and the full cell query surface (see also `world-api.md`).

Types: `node_modules/@sandustry-modding/types/sandkit/api/grid.d.ts`.

Reference: https://sandustry-modding.github.io/SandustryTypes/#/.

## Iteration methods

| Method                                                            | Role                                |
| ----------------------------------------------------------------- | ----------------------------------- |
| `forEachCellInRectangle(cellX, cellY, width, height, callback)`   | Each cell in axis-aligned rectangle |
| `forEachCellInCircle(centerCellX, centerCellY, radius, callback)` | Each cell inside circle             |

Callbacks receive `(cellX, cellY)`. Use with read-only `elements.*` / `grid.*` queries inside mod code.

## MCP equivalent (read-only)

Prefer manual loops with bounds checks against `sim.width` / `sim.height`:

```javascript
for (let dy = 0; dy < height; dy++)
  for (let dx = 0; dx < width; dx++) {
    const cx = originX + dx,
      cy = originY + dy;
    // read sim.cellIds[cy * sim.width + cx]
  }
```

For circle sampling, filter with `(dx*dx + dy*dy) <= radius*radius`.

Do not pass large callbacks through MCP. Return aggregates (counts, first match).
