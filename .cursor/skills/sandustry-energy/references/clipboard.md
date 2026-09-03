# Clipboard signal links

Engine: `sandkit.engine.api.clipboard.getSignalLinks()` (state-first).
Returns the link array on the build clipboard, or `null`.

Related: `get`, `set(structures, signalLinks?)`, `getHistory`, `selectFromHistory`, `activate`, `clear`.
Copy tool also stashes links in `session.action.customData.signalLinks`.

## Blueprint / saved link shape

Array of:

```ts
{ from: { x, y }, to: { x, y }, on: boolean }
```

`from` is sender structure origin cell. `to` is receiver structure origin cell.
Coordinates are structure grid cells (same space as `structures.getAtCell`).

## Runtime link shape (in `session.mods.signals.links`)

Keyed by sender `"x,y"`.
Values are `{ x, y, on }[]` pointing at receiver cells.
No `from` field inside entries.

Undo / move capture uses `_originalSignalLinks` and `_removedSignalLinks` on structure events.
Blueprint save (`engine.api.blueprints.save`) copies `getSignalLinks()` into stored blueprint metadata.

Do not paste full link arrays into chat - report counts and one sample entry only.
