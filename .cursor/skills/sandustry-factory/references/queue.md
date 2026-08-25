# Build queue

Two related queues: deferred tick jobs and structures waiting to finish placement.

## `store.queue[]` - tick queue

`engine.api.queue` manages this array. Live save: length `0`.

Item shape (engine):

| Field           | Role                                         |
| --------------- | -------------------------------------------- |
| `type`          | Handler id registered with `registerHandler` |
| `executeAt`     | `store.meta.time` when due                   |
| `data`          | Payload object                               |
| `key`           | Optional dedupe key                          |
| `notBeforeTick` | Optional minimum `store.meta.tick`           |

Methods (state first): `enqueue`, `enqueueInTicks`, `enqueueSkipTick`, `process`, `registerHandler`, `removeByKey`. Do not call `process` without user ask.

`store.meta`: `time` and `tick` drive scheduling.

## `structure.queued` - placement backlog

When placement clearance is `PartiallyBlocked` or `CanBeReplaced` with blocking terrain, the structure is pushed with `queued: true`. It builds when clearance clears.

Live: 10 queued structures (e.g. `conveyorLeftMk2` at `1740, 1340`).

`__debug.ensureQueuedStructuresAreBuilt` forces completion - **mutate**, do not call in probes.

Conveyor registration often passes `skipQueued: true` so belts do not transport until built.

## `sandkit.api.structures` idle builders

Deferred placement/removal when simulation is idle:

- `buildAtCellWhenIdle(x, y, structureTypeOrId, options?)`
- `removeAtCellWhenIdle`, `removeBetweenCellsWhenIdle`, `removeAtCellsWhenIdle`

These are writes. Do not call without user ask.

## Related

- `BuildingClearance` enum - `enums.md`.
- Engine batching: `engine.api.structures.beginBatchWrite` / `endBatchWrite`.
