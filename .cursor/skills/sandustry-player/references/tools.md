# Tools and grabber

Grabber is the main documented tool namespace. Other tools (Shovel, Demolisher, Copier, ...) are hotbar `ItemId` entries with abilities - see `enums.md`.

## `sandkit.api.tools.grabber`

| Method       | Arity | Notes                                     |
| ------------ | ----- | ----------------------------------------- |
| `getSize()`  | 0     | Radius in **cells** (live default **25**) |
| `setSize(n)` | 1     | **mutate**                                |
| `isActive()` | 0     | Grabber is the selected tool              |
| `isLoaded()` | 0     | Buffer holds elements                     |

Path: `sandkit.api.tools.grabber` (not top-level `api.grabber`).

Element opt-in: definition `isGrabbable` — **sandustry-world** `references/elements.md`. Grab skips when `isGrabbable === false`.

## Engine twin

`sandkit.engine.api.tools`: `getGrabberSize(state)`, `setGrabberSize(state, n)`, `isGrabberActive(state)`, `isGrabberLoaded(state)`, `blockSwitchIfGrabberLoaded(state)`.

## Live probe snippet

```js
() => {
  const g = window.sandkit.api.tools.grabber;
  return { size: g.getSize(), active: g.isActive(), loaded: g.isLoaded() };
};
```

## Related session flags

- `session.construction.demolisherActive` - demolish mode (binding `KeyBinding.Demolish`).
- Grabber loaded state blocks some hotbar switches (`blockSwitchIfGrabberLoaded` on engine).
