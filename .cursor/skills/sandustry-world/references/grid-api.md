# `api.grid` iteration

Main thread only.
Cell iteration helpers, full grid surface in `world-api.md`.

Official: [sandkit.html - api.grid](https://sandustry.com/sandkit.html).
Types: `@sandustry-modding/types` `src/sandkit/api/grid.d.ts`.

## Iteration methods

| Method                                                                    | Role                                |
| ------------------------------------------------------------------------- | ----------------------------------- |
| `forEachCellInRectangle(cellX, cellY, widthCells, heightCells, callback)` | Each cell in axis-aligned rectangle |
| `forEachCellInCircle(centerCellX, centerCellY, radiusCells, callback)`    | Each cell inside circle             |

Deprecated alias: `forEachCellInRect` -> `forEachCellInRectangle`.

Callbacks receive `(cellX, cellY)`.
Use with read-only `elements.*` / `grid.*` queries inside mod code.

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

Do not pass large callbacks through MCP.
Return aggregates (counts, first match).
