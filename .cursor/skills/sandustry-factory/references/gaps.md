# Gaps

Still open (need a save with the feature placed, or a worker attach):

- `store.pipes` / `pumpsCache` instance dumps (this save: pipes length **0**, pumpsCache `[]`)
- `pipes.isEnabledAtCell` / `getConnectedVentsAtCell` on a real pipe network
- Non-zero `shared.authorization.data` zones (this save: all sampled cells **0**)
- Full weighted refinery recipe tables per machine id
- `structures.registerPlacementConfig` live field schemas
- `engine.api.structures.getConfig` return shape
- Worker-thread structure mutations / conveyor register payloads
- Thermal machine tick internals beyond `recordProcess`
- Public placement clearance preview (`getClearanceAtCell` is not on `sandkit.api`)
- Complete mod structure id catalog (UI list in **sandustry-ui**)

`store.queue` empty on this save is expected (len 0), not a missing API.
