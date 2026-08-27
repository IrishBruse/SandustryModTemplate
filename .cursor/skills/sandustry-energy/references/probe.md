# Probe

Read-only inspection via `sandustry-mcp` `evaluate_script`. Return JSON-serializable data only.

`sandkit` is ambient in MCP `evaluate_script`. Check `typeof window.sandkit`. `__debug.state === sandkit.state`.

## Safe

- `__debug.state.shared` SAB heads: `energy`, `energyChange`, `energyBatteryDirty`, `gold`, `goldChange`, `collectorGoldCount` - use `{ len, head: Array.from(arr.slice(0, 8)) }`, never dump full tile grids.
- `__debug.state.store.resources.energy` and `.gold`.
- `__debug.state.sandkit.mods.energy` keys and `{ type, optionKeys }` per structure id.
- `__debug.state.session.mods.signals` counts: `senderTypes.size`, `receiverTypes.size`, `Object.keys(links).length`.
- One sample link: first `links` bucket key and first entry `{ x, y, on }`.
- `__debug.state.store.mods.signals` keys (`links`, `hideWires`).
- `sandkit.api.energy` / `signals` / `resources` / `collector` key lists via `Object.keys` (when `sandkit` is in scope) or webpack module source string.

## Unsafe (needs user ask)

- `sandkit.api.energy.addAtCell`, `consume`, `consumeExcludingNetworkAtCell`.
- `sandkit.api.resources.adjustEnergy` / `updateEnergy`.
- `sandkit.api.signals.targets.register`, `interactables.register`, `registerSenderType`, `setOutputAtCell` (writes handler maps / sender state).
- Engine signal `link`, `unlink`, `set`, `setAll`, `registerReceiverType`.
- `sandkit.engine.api.clipboard.set`, `activate`, `clear`.

## Example (compact)

```js
() => {
  const s = window.__debug?.state?.shared;
  const read = (a) => (a ? { len: a.length, head: Array.from(a.slice(0, 4)) } : null);
  return {
    energy: read(s?.energy),
    energyChange: read(s?.energyChange),
    gold: read(s?.gold),
    resources: window.__debug?.state?.store?.resources,
  };
};
```
