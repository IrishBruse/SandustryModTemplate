# Gaps

Still open:

- Vanilla sender / target structure id lists (counts only: **17** senders, **12** receivers, **5** interactables)
- `energyType` multi-network example on a live save
- `energy.addAtCell` return when the network is partially full (do not call in probes unless the user asks)
- `getNetworkAtCell` populated entry shape (HTML: `{ cellX, cellY, type }`; this save had no energy structures)
- Worker-thread energy simulation
- Per-structure engine `onCharge` / `onConsume` args
- On-disk encoding for `store.mods.signals.links`

Heat coupling: **sandustry-world**. Signal tool clicks: **sandustry-ui**.
