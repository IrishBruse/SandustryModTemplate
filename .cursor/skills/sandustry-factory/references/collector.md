# Collector admission (vanilla 0.5.5)

## Public API (read-only)

Official `sandkit.api.collector`: `getValueFromCellId`, `getValueByType`, `isCellIdCollectable`, `isCellIdCollectableForSprite`, `notifyPickupAtCell`.
No admission or prepare hook in the Sandkit HTML.

## Value map vs tile admission

Vanilla builds a per-type value map from `collectable.value` on mod elements (plus Gold = 1):

```js
const t = new Map();
t.set(r.RJ.Gold, 1);
Object.values(e.sandkit.mods.elements).forEach((e) => {
  const n = e?.collectable;
  if (e && e.elementType != null && n?.value != null) t.set(e.elementType, n.value);
});
return t;
```

Public `getValueByType` / `isCellIdCollectable` read that map.
The bundle helper is `getValueFromElementType`.

**Tile admission** (whether an element may enter a Collector footprint) is separate.
In `js/bundle.js`, `js/simulation-worker.js`, and `js/utility-worker.js` the check is still:

```js
// when block type is Collector (c)
const liquidGoldType = /* cached getElementTypeFromId(e, "liquidGold") */;
return t.type === Gold || t.type === liquidGoldType ? allow : deny;
```

Only **Gold** and **liquidGold** pass by default.
Other element types with `collectable.value` stay on the value map for payout queries, but they do not enter Collector tiles.

## Related

- Element registration: `collectable: { value: N }` on `api.elements.register` / `updateDefinition`.
- Economy vs energy: **sandustry-energy** `references/gold-collector.md`.
