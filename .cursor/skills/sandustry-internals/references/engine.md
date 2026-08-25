# Engine API

`sandkit.engine.api` is the **state-first** twin of public `sandkit.api`. Prefer public methods. Engine calls take **game state as `args[0]`**. Types: `modkit/types/sandkit/engine/`. Generated pages: `docs/api/engine/`.

Live counts: public **54** namespaces, engine **86**. `sandkit.engine.state === sandkit.state`.

## Public-only (not on engine.api)

`assets`, `gameConfig`, `mods`, `settings`, `shared`, `structureBehaviors`, `time`.

Public `workers` is only `setPostUpdateEnabled`. Public `mods` is only `getProviders`.

## Engine-only namespaces (live keys)

| Ns | Methods (live) |
| -- | -------------- |
| `augments` | getDig/Gun/Phase/RocketAmmo/RocketReload/SprintCap Level, hasBigDig, hasBulletSpeed, hasBulletTracer, hasKickstartBoost, hasPhaseDash, hasPhaseDashCharge, hasRideBoost, hasRocketDamage, hasRocketWarhead, hasSprintPower, hasTripleShot |
| `auralite` | ensureProducedAtLeast, getProduced |
| `blueprints` | delete, exportAllString, exportString, getAll, importString, load, save |
| `clipboard` | activate, clear, get, getHistory, getSignalLinks, selectFromHistory, set |
| `colorPicker` | CYCLE/NO/RANDOM_COLOR, PREDEFINED_COLORS, close/get/set/toggle palette, hex/rgba, render\* |
| `coloringTool` | colorStructure, floodFillColor, get/setColor, isColorableStructure, isMatchColorMode, isPaintBucketMode, toggle\* |
| `config` | function arity **2** (not a namespace) |
| `conveyors` | registerType |
| `debug` | register |
| `drones` | kill, spawn |
| `entities` | createLight, getAll, getAllByType, getAllTypeDefs, getSprite, getTypeDef, launch, registerSpawner, registerType, spawn, startCapture |
| `extend` | function arity **3**, name `extend` |
| `extensions` | define |
| `factory` | addViabilityGold, canUnlockNextTier, ensureProcessAtLeast, flushDeferredLevelUps, getLevel, getProcessCount, getProcessRate, recordProcess, unlockNextTier |
| `foliage` | generate, getClusters, getContainer, hasProcgenData |
| `foundationColorPicker` | getColor |
| `game` | load, save, start |
| `heatTransfer` | absorbAdjacentElements, addTemperature, computeDiffused/EqualizedTemperature, consumeTemperatureNear, ensureTemperature, equalizeConnected |
| `launchers` | registerType |
| `lightColorPicker` | getColor |
| `matters` | getMatterTypeFromId, register, runSolidUpdate |
| `misc` | register |
| `portals` | getMarkers |
| `prefabData` | getAll, getAllMetadata, getArtifactLocations, getAtCell, getMetadata |
| `prefabDecor` | getPlacementByName, replaceDecor |
| `prefabulator` | localizeBlueprintStructures, serializeBlueprintStructures |
| `prismaline` / `prismite` | consume, getAvailable, getConsumed |
| `queue` | enqueue, enqueueInTicks, enqueueSkipTick, process, registerHandler, removeByKey |
| `retroConsole` | registerGame |
| `shadows` | refresh, refreshRadius, refreshRect |
| `strataform` | getDefaultConfig, getRegisteredTypes, registerType, trigger, triggerByType |
| `swarmConsole` | decrementConvergenceBuffer, getCrystalMined, getDiskRadiusCells, getEntityType, getNearestConvergence, getPendingConvergence, getPlacedConsoles, getRadiusPx, isSpawnJammed, registerEntityType, resetAllConvergenceBuffers, setSpawnJammed |
| `sweeperDrone` | cancelSelection |
| `teleportZones` | add, getAll, getAtCell, getById, remove, spawnDefaultParticles, teleportPlayerTo |
| `tutorialBuild` | areAll/FamilyTargetsBuilt, canPlaceAtActiveTarget, getFoundationMoveDests/Sources, getTargets, hasDefinition, isStepConstrained, matchesFoundationMove/Remove, shouldProtectActiveTargetAt |
| `usageTracker` | clear, getLatest, getMostUsed |
| `wall` | getPaletteData, getWallDataAt, getWallDataSize, setWallDataAt |
| `workerLocal` | clear, get, getOrInit, set |

Overlap namespaces (action, building, camera, ...) exist on **both** bags with different signatures. Use `sandkit.api` in mods unless you already hold state.
