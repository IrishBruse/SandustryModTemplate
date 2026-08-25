# Gaps

Not walked or not confirmed in this 0.5.2 pass:

- `store.queue` item samples (empty on probe save — **confirmed** len 0)
- `store.pipes` / `pumpsCache` instance dumps (no pipes placed — **confirmed** len 0)
- Non-zero `shared.authorization.data` zone layouts (only zone `0` sampled)
- Full weighted refinery recipe tables per machine id
- `structures.registerPlacementConfig` live field schemas per structure
- `engine.api.structures.getConfig` return shape
- Worker-thread structure mutations and `RegisterConveyorType` worker payloads
- Blueprint encode/decode for structures (`engine.api.blueprints`)
- Signal-linked structures (logic tab) - routing in **sandustry-energy**
- Thermal machine tick internals (burner belt, smelter, ...) beyond `recordProcess` hooks
- `placement` clearance preview API (no public `getClearanceAtCell`; engine-only path)
- Complete mod structure id catalog (65 mods + 108 unlocked types; UI list in **sandustry-ui**)
