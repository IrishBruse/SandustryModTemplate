# Probe

Read-only inspection of the live world sim. Return JSON-serializable data only.

## Entry points

| Object                        | Use                                                    |
| ----------------------------- | ------------------------------------------------------ |
| `__debug.state`               | Same as `sandkit.state`. Main probe bag.               |
| `__debug.config`              | `cellSize`, `chunkSize`, gravity, multithreading flag. |
| `__debug.getSchedulingMode()` | Sync read of scheduling mode (0-2).                    |

`sandkit.api` is a mod-bundle closure symbol. It is **not** on `window`. For MCP, read `__debug.state.shared.sim` directly or use typed API only inside mod code.

Cross-links: **sandustry-internals** `references/probe.md`, **sandustry-ui** for F3 overlays.

## Safe

- `Object.keys` on `__debug.state.store.world`, `__debug.state.shared.sim`, `__debug.state.environment.multithreading`.
- Read `__debug.config.cellSize`, `chunkSize`, `useMultithreading`, `obstacleBreakpoint`.
- Read one `shared.sim.cellIds[y * width + x]` and decode with id ranges in `grid-chunks.md`.
- Read scalar fields from `shared.sim.elementData.*[elementIndex]` for one index.
- Read one `shared.wallData.data[i]`, `shared.shadowMap.data[i]`, `shared.waterPresenceZones[zoneIndex]`.
- Coarse stride scans (for example step 40) for counts, not full grid dumps.
- `__debug.getSchedulingMode()`.

## Unsafe (needs user ask)

- Any cell or terrain mutation: `excavateAtCell`, `reportActivityAtCell`, `revealFogAtCell`, `redrawAroundCellWhenIdle`, `*AtCellWhenIdle`, terrain `createAtCell` / `replaceAtCell` / `removeAtCell` / `damageAtCell`.
- Engine mutators: `wall.setWallDataAt`, `heatTransfer.*`, `foliage.generate`, `shadows.refresh*`, `matters.register`, `engine.api.game.*`.
- Pickup spawn/destroy: `world.pickups.spawnAtWorld`, `destroy`, `pickUp`.
- Save/load IPC, `__debug.admin.run`, `__debug.setSchedulingMode`, `__debug.moveCamera`.

## Sample script shape

```javascript
() => {
  const st = __debug.state;
  const sim = st.shared.sim;
  const x = 920,
    y = 1440;
  const i = y * sim.width + x;
  return {
    cellId: sim.cellIds[i],
    liveElements: sim.liveElementCount[0],
    chunkSize: sim.chunkSize,
  };
};
```

Pass `waitForStableDom: false`.
