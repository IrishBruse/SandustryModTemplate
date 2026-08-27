# `sandkit.api.signals`

Main thread only. Official HTML (0.5.5) lists four public entry points, runtime detail in `engine-signals.md`.

## Live keys (0.5.5)

| Path                                | Method                                        | Role                                          |
| ----------------------------------- | --------------------------------------------- | --------------------------------------------- |
| `sandkit.api.signals.targets`       | `register(structureTypeOrId, apply)`          | Receiver handler when incoming links change.  |
| `sandkit.api.signals.interactables` | `register(structureTypeOrId, handler)`        | Override structure interact (click) behavior. |
| `sandkit.api.signals`               | `registerSenderType(structureId, getOutput?)` | Register a structure type as a signal sender. |
| `sandkit.api.signals`               | `setOutputAtCell(cellX, cellY, on)`           | Set sender output at a structure origin cell. |

`targets.register` wraps `sandkit.engine.api.signals.targets.register`. The handler receives:

- `structure` - structure instance at the receiver cell.
- `payload` - official shape `{ combined, inputCount, onCount }`.

`combined` is true when any incoming link to that receiver is on. `inputCount` is incoming link count. `onCount` is how many of those are on.

`interactables.register` handler receives `structure` only. Use for custom toggle / lever logic, call `api.structures.update(structure)` when mutating `structure.data`.

`registerSenderType` optional `getOutput(structure)` returns boolean output. Vanilla senders use this, mods can also drive output with `setOutputAtCell`.

`setOutputAtCell` is a **mutator** - do not call in read-only probes.

Types may still list `StructureType`, `Structure`, `SignalTargetPayloadV1` as `unknown`. Prefer the official payload above.

There is no public `sandkit.api.signals.link` - linking is in-game UI or engine `signals.link`.
