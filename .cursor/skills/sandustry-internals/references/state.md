# State

`sandkit.state` keys: `environment`, `sandkit`, `session`, `shared`, `store`. Stubs in `node_modules/@sandustry-modding/types/sandkit/engine/state.d.ts` are thinner than live.

## `session` (live)

action, actionLocked, ambience, animations, building, buttons, cache, camera, cheat, cinematic, colors, construction, debug, effects, explosions, externalMods, factoryProcessRates, input, lerpCamera, lexicon, lightZones, lights, mainSensorCache, mods, monitor, movementSpeedMultiplier, music, nextTickCallbacks, notifications, overrideCamera, paused, platform, prefabWorldItemCache, reconMode, rendering, resolution, runtime, saving, scale, settings, soundBox, soundEngine, sprintBoost, teleportZoneCache, timestep, triggers, ui, view, visualParticles, windows, zoomLevel.

Nested: `session.ui` - dialogs, discoveryPopups, hudHidden, introScreen, listeners, nextListenerId, overlays, tooltip, visible. `session.debug` - brush. `session.cheat` - bypassCosts.

## `store` (live)

achievements, conservatory, createdVersion, creatures, discoveries, drones, factoryLevelCap, gloom, hints, integrity, lockedTechs, machineryEngine, meta, mods, objectives, options, owner, pipes, player, productionPoints, progression, projectiles, pumpsCache, queue, resources, scene, stratacores, structures, tutorial, upgrades, version, viability, world, worldItems.

Notable 0.5.5 fields: `version` (game build, e.g. **0.5.5**), `createdVersion` (save origin, may lag, e.g. **0.5.2**), `gloom.emitterPositions` (array), `machineryEngine.runLaunchers` (boolean), `stratacores` (array).

## `shared` (live)

actionState, authorization, collectorGoldCount, conveyorBeltsAnimationIndex, debug, energy, energyBatteryDirty, energyChange, gold, goldChange, hybridScheduling, listenerPos, managerPerformance, mapData, mods, mouse, mutationSync, naturalAmbience, playerPos, productionPoints, reservoir, schedulingMode, shadowMap, sim, wallData, waterPresenceZones (+ Height/Width), workQueue, workerCompletion, workerDetailEnabled, workerDetailPerformance, workerPerformance.

`schedulingMode` and `hybridScheduling` are `Uint8Array` length **1** (JSON prints `{ "0": 1 }`). Layout: **sandustry-world** `workers.md`.

## `sandkit` (under state)

events, gameReady, graphics, hooks, keyBindings, mods, registeredLauncherTypes.
