# `__debug` and F3

`window.__debug` is a renderer helper bag. `__debug.state` is the same object as `sandkit.state`.

## Keys

| Key                              | Live                                      |
| -------------------------------- | ----------------------------------------- |
| `admin`                          | `{ run, spawnCustomLight }` - do not call |
| `config`                         | Game config object (read OK)              |
| `state`                          | Alias of `sandkit.state`                  |
| `checkElementPositions`          | fn arity 0                                |
| `ensureQueuedStructuresAreBuilt` | fn arity 0 - mutates                      |
| `getSaveFolder`                  | fn arity 0                                |
| `getSchedulingMode`              | fn arity 0                                |
| `setSchedulingMode`              | fn arity 1 - mutates                      |
| `moveCamera`                     | fn arity 2 - mutates                      |
| `tally`                          | fn arity 0                                |
| `trackMemoryConsumption`         | fn arity 1                                |

## `__debug.config` (historical 0.5.2 probe)

Current game extract: read `sandustry/source/package.json` after `npm run setup`.
Probe `__debug.config.version` in a live session.
Do not assume the table below on 0.5.5+.

| Field                       | Value (0.5.2 session)       |
| --------------------------- | --------------------------- |
| `version`                   | `"0.5.2"`                   |
| `cellSize`                  | 4                           |
| `chunkSize`                 | 40                          |
| `snapGridCellSize`          | 4                           |
| `fps`                       | 60                          |
| `lockFps`                   | false                       |
| `gravity`                   | ~216                        |
| `upflow`                    | ~-21.6                      |
| `conveyorDefaultSpeed`      | 0.05                        |
| `obstacleBreakpoint`        | 100                         |
| `startingResources`         | 0                           |
| `blueprintEncoding`         | `"binary"`                  |
| `useMultithreading`         | true                        |
| `useExperimentalRenderer`   | false                       |
| `playerSize`                | `{ width: 12, height: 30 }` |
| `customMaps.showCustomMaps` | false                       |
| `mods.showSubscribedMods`   | false                       |

`config.debug` flags (keys only): active, badDisplays, brushShape, brushSize, brushThrottle, cellInspector, controls, countEvents, defaultBaseHue, doNotDrawStructures, drawChunkFade, drawChunks, drawRulers, flashlight, gameOfLife, highlightBrush, i18nDebug, lightSize, overrideLightSize, overrideTerrainShadow, preventDuplicateCells, selectedLightIndex, showAuthorizationZones, showFilters, showLights, showProximityFade, showProximityFadeSelectedOnly, showThreadLoad, showUnderlyingCellsInStructures, stopOnDebugCellUpdate, strictSafeguards, terrainShadowValue.

F3 **panel chrome** is sandustry-ui `references/debug.md`.
Engine overlay register: `sandkit.engine.api.debug.register`.
