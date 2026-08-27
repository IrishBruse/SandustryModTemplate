# Void world (batched MCP)

Turn a live save into an empty void world via `evaluate_script`. **User must ask** — these are mutators, not probe scripts.

Grid: **3840×3840** cells (`shared.sim.width` / `height`). Full-grid work must be **batched** or MCP times out and the renderer freezes.

Pass `waitForStableDom: false` on every call. Re-run `list_pages` after reload; `pageId` changes.

## Batch sizes (live 0.5.2)

| Work                                                         | Rows per MCP call | Notes                            |
| ------------------------------------------------------------ | ----------------- | -------------------------------- |
| Buffer clear (`cellIds`, `wallData`, `shadowMap`, `mapData`) | **256**           | Fast `TypedArray.fill` per row   |
| `engine.api.world.revealFogAtCell`                           | **128–512**       | 128 safe; 512 OK for map uncover |
| Structures / background / player fix                         | **1 call**        | Small metadata                   |

Save every **~1024** cleared rows or after each fog chunk group.

## Save as you go

Use engine save (queues `session.saving`, writes via main process):

```javascript
() => {
  const st = sandkit.state;
  const eng = sandkit.engine.api;
  // New save:
  const id = eng.game.save(st, "Void");
  // Overwrite existing:
  const id2 = eng.game.save(st, "Void", "iqmnmj620gd");
  return { id, id2 };
};
```

First save returns a new id string. Pass that id on later saves to overwrite the same slot.

## Phase 1 — structures, entities, hotbar guard

Run once before grid batches. Fixes `activeSlotIndex: null` on fresh worlds (prevents later input crashes).

```javascript
() => {
  const sk = sandkit;
  const st = sk.state;
  const eng = sk.engine.api;
  const hb = st.store.player.hotbar;
  if (hb.activeSlotIndex == null || hb.bars[hb.hotbarIndex][hb.activeSlotIndex] == null) {
    hb.hotbarIndex = 0;
    hb.activeSlotIndex = 0;
  }
  const w = st.shared.sim.width;
  const h = st.shared.sim.height;
  eng.structures.removeBetween(st, 0, 0, w - 1, h - 1);
  st.store.structures.length = 0;
  if (st.store.pipes) st.store.pipes.length = 0;
  if (st.store.pumpsCache) st.store.pumpsCache.length = 0;
  if (st.store.worldItems) st.store.worldItems.length = 0;
  if (st.store.mods?.entities?.list) st.store.mods.entities.list.length = 0;
  st.shared.sim.liveElementCount[0] = 0;
  const saveId = eng.game.save(st, "Void");
  return {
    structures: st.store.structures.length,
    entities: eng.entities.getAll(st).length,
    saveId,
    hotbar: hb.bars[hb.hotbarIndex][hb.activeSlotIndex],
  };
};
```

## Phase 2 — grid buffer clear (repeat per row range)

Replace `startY` / `endY` each call. Example: `0→256`, `256→512`, … `3584→3840` (15 calls).

```javascript
() => {
  const st = sandkit.state;
  const sim = st.shared.sim;
  const ids = sim.cellIds;
  const wall = st.shared.wallData.data;
  const shadow = st.shared.shadowMap.data;
  const map = st.shared.mapData.data;
  const w = sim.width;
  const startY = 0;
  const endY = 256;
  for (let y = startY; y < endY; y++) {
    const i = y * w;
    ids.fill(0, i, i + w);
    wall.fill(0, i, i + w);
    shadow.fill(0, i, i + w);
    map.fill(0, i * 4, (i + w) * 4);
  }
  sim.chunkShouldUpdate.fill(1);
  sim.chunkShouldUpdateNext.fill(1);
  sim.liveElementCount[0] = 0;
  return { startY, endY, ok: true };
};
```

Optional save after every fourth batch:

```javascript
() => {
  // ... same loop ...
  const saveId = sandkit.engine.api.game.save(st, "Void", "YOUR_SAVE_ID");
  return { startY, endY, saveId };
};
```

## Phase 3 — background and parallax

Clears procgen decor and hides Pixi background layers. See **sandustry-world** `references/background-layers.md`.

```javascript
() => {
  const sk = sandkit;
  const st = sk.state;
  const eng = sk.engine.api;
  const world = st.store.world;
  const pixi = st.session.rendering.pixi;
  const hide = (s) => {
    if (!s) return;
    s.visible = false;
    s.alpha = 0;
    if (s.renderable !== undefined) s.renderable = false;
  };

  if (world.horizon) world.horizon.fill(0);
  if (world.groundHorizon) world.groundHorizon.fill(0);
  if (world.fixtures) world.fixtures.length = 0;
  if (world.lights) world.lights.length = 0;
  if (world.teleportZones) world.teleportZones.length = 0;
  if (world.sensors) world.sensors.length = 0;
  if (st.store.mods?.prefabData?.placements) st.store.mods.prefabData.placements.length = 0;
  if (st.store.mods?.foliage?.data?.prefabPlacements) {
    st.store.mods.foliage.data.prefabPlacements.length = 0;
  }
  const fc = eng.foliage?.getContainer?.(st);
  if (fc?.removeChildren) fc.removeChildren();
  const clusters = eng.foliage?.getClusters?.(st);
  if (Array.isArray(clusters)) clusters.length = 0;

  hide(pixi.mountainsSprite);
  hide(pixi.treesSmallSprite);
  hide(pixi.treesSprite);
  hide(pixi.bgL04Sprite);
  hide(pixi.bgL04Extension);
  hide(pixi.backgroundEntitiesContainer);
  hide(pixi.mapSprite);
  if (pixi.backgroundEntitiesContainer?.removeChildren) {
    pixi.backgroundEntitiesContainer.removeChildren();
  }
  if (pixi.filter?.uniformGroup?.uniforms) {
    pixi.filter.uniformGroup.uniforms.uDrawUndergroundFog = false;
  }

  eng.shadows.refresh(st);
  const saveId = eng.game.save(st, "Void", "YOUR_SAVE_ID");
  return { ok: true, saveId, prefabs: eng.prefabData?.getAll?.(st)?.length ?? 0 };
};
```

## Phase 4 — in-game map (M) fog

The **map screen** uses a separate buffer from world `revealFogAtCell`:

| Field       | Path                       | Live                                        |
| ----------- | -------------------------- | ------------------------------------------- |
| Fog raster  | `store.mods.map.fogBuffer` | 960×960 (4:1 vs world cells)                |
| Size        | `fogWidth`, `fogHeight`    | 960                                         |
| Compression | `fogBufferCompressed`      | `true` = RLE triplets; `false` = flat array |

**Small fix** (one call — do not teleport-grid scan; that freezes):

```javascript
() => {
  const st = sandkit.state;
  st.session.paused = true;
  const m = st.store.mods.map;
  if (!m.fogBufferCompressed && m.fogBuffer?.fill) {
    m.fogBuffer.fill(0); // 0 = revealed on live 0.5.2
  } else {
    m.fogBuffer = [0, 255, m.fogWidth * m.fogHeight];
    m.fogBufferCompressed = true;
  }
  m.revealed = true;
  m.unlocked = true;
  const saveId = sandkit.engine.api.game.save(st, "Void", "YOUR_SAVE_ID");
  st.session.paused = false;
  return { saveId };
};
```

Close and reopen the map (**M**) after save. World-cell `revealFogAtCell` batches do **not** fill this UI buffer.

## Phase 4b — world fog uncover (optional, batched)

Even after buffer clear, run `revealFogAtCell` in batches if in-world fog cells remain. Use **512-row** chunks with saves:

```javascript
() => {
  const st = sandkit.state;
  const eng = sandkit.engine.api;
  const w = st.shared.sim.width;
  const startY = 0;
  const endY = 512;
  for (let y = startY; y < endY; y++) {
    for (let x = 0; x < w; x++) eng.world.revealFogAtCell(st, x, y);
  }
  const saveId = eng.game.save(st, "Void", "YOUR_SAVE_ID");
  return { startY, endY, saveId };
};
```

Repeat with `startY` / `endY`: `512→1024`, `1024→1536`, … `3072→3840`.

Fog terrain ids: `4`, `5`, `6`, `13` (**sandustry-world** `references/cells.md`).

## Phase 5 — player platform and movement

Void worlds have no ground. Place **Block** terrain (`cellId` **15**) and reset movement. Pick a **weapon or tool** hotbar slot — not a mod item or structure belt slot.

```javascript
() => {
  const sk = sandkit;
  const st = sk.state;
  const eng = sk.engine.api;
  const p = st.store.player;
  const sim = st.shared.sim;
  const w = sim.width;
  const hb = p.hotbar;

  hb.hotbarIndex = 0;
  hb.activeSlotIndex = 0;
  if (!hb.bars[0][0]) hb.bars[0][0] = { id: 1, type: 1 };
  try {
    sk.api.building.cancelPlacement();
  } catch {}
  st.session.building.placing = false;
  st.session.building.activeStructureType = null;

  sk.api.player.setMovementMode("normal");
  sk.api.player.setMovementSpeedMultiplier(1);
  sk.api.player.setVelocity(0, 0);
  p.isHovering = false;

  const cx = 1920;
  const floorY = 2000;
  for (let dx = -12; dx <= 12; dx++) {
    for (let dy = 0; dy < 2; dy++) {
      const x = cx + dx;
      const y = floorY + dy;
      if (x >= 0 && y >= 0 && y < sim.height) sim.cellIds[y * w + x] = 15;
    }
  }
  sk.api.player.setPositionAtWorld(cx * 4, floorY * 4 - (p.height || 30) - 4);

  eng.shadows.refresh(st);
  sk.api.grid.redrawAroundCell(cx, floorY, 40);
  const saveId = eng.game.save(st, "Void", "YOUR_SAVE_ID");
  return {
    saveId,
    pos: sk.api.player.getPositionAtWorld(),
    isOnGround: sk.api.player.isOnGround(),
    selected: sk.api.action.getSelected(),
  };
};
```

## Verify (read-only)

```javascript
() => {
  const st = sandkit.state;
  const sim = st.shared.sim;
  const ids = sim.cellIds;
  let fog = 0;
  let nonEmpty = 0;
  for (let i = 0; i < ids.length; i += 8192) {
    const id = ids[i];
    if (id === 4 || id === 5 || id === 6 || id === 13) fog++;
    if (id !== 0) nonEmpty++;
  }
  return {
    structures: st.store.structures.length,
    liveElements: sim.liveElementCount[0],
    entities: sandkit.engine.api.entities.getAll(st).length,
    coarseFogSamples: fog,
    coarseNonEmptySamples: nonEmpty,
    prefabs: sandkit.engine.api.prefabData?.getAll?.(st)?.length ?? 0,
    player: sandkit.api.player.getPositionAtWorld(),
    onGround: sandkit.api.player.isOnGround(),
  };
};
```

## Triage: `handleAction` crash

Console: `TypeError: Cannot read properties of undefined (reading 'handleAction')`.

| Cause                                                            | Fix                                                                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Hotbar on mod item (`type: 4`) without handler                   | Set `hotbarIndex` / `activeSlotIndex` to vanilla `{ id: 1, type: 1 }` weapon or `{ id: 2, type: 3 }` tool |
| `activeSlotIndex: null` on new game                              | Force bank `0`, slot `0` before other mutations                                                           |
| Build mode still targeting structure                             | `api.building.cancelPlacement()`, clear `session.building.activeStructureType`                            |
| `action.getSelected()` shows structure while hotbar shows weapon | Trust `hotbar.bars[bank][slot]`; cancel build mode                                                        |

Movement in void: player falls until `isOnGround` is true — place Block (`15`) tiles under feet.

## Related

- Background layer map: **sandustry-world** `references/background-layers.md`
- Save IPC shape: **sandustry-internals** `references/engine.md` (`game.save`)
- Player hotbar / action: **sandustry-player** `references/items.md`, `references/action.md`
- MCP attach: `scripts.md` attach check
