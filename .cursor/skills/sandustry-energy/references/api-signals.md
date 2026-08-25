# `sandkit.api.signals`

Main thread only. Public surface is small, runtime logic lives in `engine-signals.md`.

## Live keys (module `92015`)

| Path                          | Method                               |
| ----------------------------- | ------------------------------------ |
| `sandkit.api.signals.targets` | `register(structureTypeOrId, apply)` |

`register` wraps `sandkit.engine.api.signals.targets.register`. The handler receives:

- `structure` - structure instance at the receiver cell.
- `payload` - live shape `{ combined, inputCount, onCount }` (not the stub `unknown` in `signals.d.ts`).

`combined` is true when any incoming link to that receiver is on. `inputCount` is incoming link count. `onCount` is how many of those are on.

Types still list `StructureType`, `Structure`, `SignalTargetPayloadV1` as `unknown`. Prefer the live payload above.

There is no public `sandkit.api.signals.link` - linking is in-game UI or engine `signals.link`.
