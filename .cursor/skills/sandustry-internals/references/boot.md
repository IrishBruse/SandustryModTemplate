# Renderer boot (Loader)

`#loading` is the splash. After splash, **Loader** (ComponentId **11**) shows i18n keys under `ui|loading|*`.

Progress max is **7**. `PI(key, 7)` sets **Starting game**. That label stays until boot removes `#loading`.

## Steps (0.5.5)

| Progress | Key                   | Work                                       |
| -------- | --------------------- | ------------------------------------------ |
| 1        | `bootstrapping`       | Locale, debug localStorage, URL boot flags |
| ...      | `images` / `sounds`   | Asset fetch                                |
| 4        | `initializingSystems` | Sound engine                               |
| 7        | `startingGame`        | Everything below until the overlay hides   |

**Compiling shaders...** is a separate overlay (`ui|loading|compilingShaders`), not a Loader checklist row.

## Work under Starting game

Order after `?db_load=` / Continue:

1. Load save (`electron.load`). Parse store, wall, matrix, shadow, authorization.
2. Build Pixi/session, then allocate SharedArrayBuffers for `store.world.size` (vanilla **3840 x 3840**): `cellIds` ~56 MB, `mapData` ~56 MB, wall + shadow ~14 MB each, plus **1000000** element slots and **14** sim workers.
3. `pj()` - key bindings + Pixi overlay containers (`ET.init`).
4. Run external mods.
5. `regenerateOutlineElementsShader`.
6. `await foliage.generate()`.
7. Nested loop over **every cell** (`height` then `width`): `getCellId`, write map raster, optional authorization stamp. Empty cells still pay this cost.
8. If packed `shadow.data` length is not `shadowMap.data.length`, full `shadows.refresh`. Else `data.set`.
9. `await SI` - **Compiling shaders...** overlay until warmup finishes. `SI` is **null** when `sessionStorage.splashShown` is set **and** the URL has no `db_load`. Then this wait is skipped and outline GPU compile does not run.
10. Fade `#loading` out.

An empty Void save is **~11 KB** on disk. A full world is **~1.3 MB**. Disk size does not skip steps 2, 7, or 8.

## Live page-reload timings (0.5.2, Void `?db_load=`)

Marks on `globalThis.__hrBoot` (ms from bundle start). Fast boot **on**, skip shader **off**:

- Splash / assets until **Starting game**: **0.2 s**
- Save load: **0.4 s**
- Pixi / session before SAB: **0.9 s**
- SAB alloc: **0.2 s**
- Worker init: **0.2 s**
- `pj()` bindings / overlay init: **8.5 s**
- Mods + outline regen + foliage: under 0.1 s
- After foliage until hide (mostly `await SI` shader wait): **28 s**
- **Total to hide Loader: ~39 s**

Raster and shadow rebuild were skipped by fast boot. They were not the remaining wait.

## Save file layout

Path: `~/.config/sandustry/saves/<id>.save`.

1. First line: JSON meta (`id`, `timestamp`, `playTime`, `worldId`, `worldName`, `seed`, ...).
2. After the first newline: **gzip** of JSON `{ store, wall, matrix, shadow, authorization }`.

`matrix` / `shadow` / `authorization` use packed lists (RLE-style), not full typed arrays. Void decompresses to **~213 KB**. The live sim still uses full 3840 buffers.

## Related

- Loader ComponentId: **sandustry-ui** `references/overlay-api.md`
- Grid sizes: **sandustry-world** `references/grid-chunks.md`
- Save IPC: `electron.md`
