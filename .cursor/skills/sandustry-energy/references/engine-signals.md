# Engine signals runtime

Public surface: `api-signals.md` (`targets`, `interactables`, `registerSenderType`, `setOutputAtCell`). Full runtime is engine-internal (`Jd.Q` in bundle). Persisted slice: `store.mods.signals`.

## Persisted (`store.mods.signals`)

| Field       | Live    | Role                              |
| ----------- | ------- | --------------------------------- |
| `links`     | object  | Wire graph (same ref as runtime). |
| `hideWires` | boolean | Live `false` on this save.        |

## Session (`state.session.mods.signals`)

Built at init. Live counts on this save (0.5.5): **17** sender types, **12** receiver types, **5** interactable handlers, **6** link buckets.

**Probe note:** `senderTypes` and `receiverTypes` are **`Set`** instances. Use `.size`, not `Object.keys()` (returns `[]` on Sets).

| Field                                                                  | Role                                                              |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `links`                                                                | Map keyed `"senderX,senderY"` -> `{ x, y, on }[]` receiver cells. |
| `pendingLink`                                                          | In-progress link tool `{ x, y }` or null.                         |
| `senderTypes`                                                          | `Set` of structure type ids that can emit.                        |
| `senderOutputGetters`                                                  | `Map<type, (state, structure) => boolean>`.                       |
| `receiverTypes`                                                        | `Set` of types with `targets.register` handlers.                  |
| `receiverApply`                                                        | `Map<type, apply callback>`.                                      |
| `incomingByReceiver`                                                   | Derived index `"rx,ry"` -> link entries.                          |
| `dirtyReceivers`                                                       | Receivers needing recompute (loop cap 128).                       |
| `lastAppliedCombined` / `lastAppliedInputCount` / `lastAppliedOnCount` | Dedup caches.                                                     |
| `interactableHandlers`                                                 | Structure interact overrides.                                     |
| `onTargetRegistered`                                                   | Internal hook when a receiver type registers.                     |

## Engine-only methods (not on `sandkit.api`)

`init`, `registerReceiverType`, `set`, `setAll`, `getCombinedAt`, `getIncomingCountAt`, `getOnCountAt`, `link`, `unlink`, `unlinkAllAt`, `hasLink`, `getAnchorPoint`, `drawWireSegment`, plus link-mode `interactAtCell`.

`registerSenderType`, `registerInteractable`, and `set` output are exposed on `sandkit.api.signals` as `registerSenderType`, `interactables.register`, and `setOutputAtCell`.

Event: `signals:userChanged` (undo history). Combinational loop toast when `dirtyReceivers` does not drain.

Vanilla signal structure ids include `signalToggle`, `signalSwitch`, `signalRepeater`, `signalGate`, `signalBuffer` - sprite / gate logic uses `getCombinedAt`.
