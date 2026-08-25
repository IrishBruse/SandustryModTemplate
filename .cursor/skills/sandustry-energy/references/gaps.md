# Gaps

Not walked or not fully confirmed in the 0.5.2 MCP pass:

- Full `SignalTargetPayloadV1` typing in `signals.d.ts` (live payload is `{ combined, inputCount, onCount }`).
- Every vanilla `registerSenderType` / receiver handler (17 / 12 counts only).
- `energyType` multi-network mod example on a live save.
- `sandkit.api.energy.addAtCell` return value edge cases (partial fill).
- Worker-thread energy network simulation details.
- Heat transfer coupling (reactor coolant, turbines) - **sandustry-world**.
- Per-structure `onCharge` / `onConsume` callback args (engine-only).
- Signal link tool UX and radial - **sandustry-ui** if clicking matters.
- On-disk save encoding for `store.mods.signals.links` beyond live object shape.
