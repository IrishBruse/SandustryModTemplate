# Probe

Read-only inspection of live player objects. Return JSON-serializable data only.

## Access

```js
const sk = window.sandkit;
const api = sk.api;
const state = sk.state; // === sk.engine.state === __debug.state
const eng = sk.engine.api;
```

`sandkit` is on `window` in the renderer during play. Mod bundles may also see `sandkit` as a host free variable.

## Safe reads

- `Object.keys` on `sandkit.api.player|tools|building|input|camera|action|items`.
- Field reads on `state.store.player`, `state.session.{camera,input,building,action,construction,cheat}`.
- Sync getters: `api.player.getPositionAtWorld()`, `api.player.isOnGround()`, `api.tools.grabber.getSize()`, `api.tools.grabber.isActive()`, `api.tools.grabber.isLoaded()`, `api.action.getActive()`, `api.action.getSelected()`, `api.input.getMouseCellPosition()`, `api.input.getBoundKeys(id)`, `api.input.isCtrlHeld()`, `api.input.isAltHeld()`, `eng.clipboard.get()`, `eng.clipboard.getHistory()`, `eng.coloringTool.getColor(state)`, `eng.colorPicker.PREDEFINED_COLORS`.
- Enum objects: `sandkit.enums.{BuildMode,ActionType,ActionState,KeyBinding,ItemId,ItemType,AbilityType}`.

## Unsafe (needs user ask)

- Player mutators: `api.player.setPositionAtWorld`, `setVelocity`, `setMovementSpeedMultiplier`, `setMovementMode`, `teleportToGround`, `inventory.addById`, `buildings.unlockById`.
- Camera mutators: `api.camera.snapToPlayer`, `setFocusAtWorld`, `releaseFocus`; `__debug.moveCamera`.
- Building mutators: `api.building.cancelPlacement`, `selectStructure`.
- Input mutators: `registerBinding`, `triggerBinding`, `pressBinding`, `releaseBinding`, `resetMouseState`.
- Action mutator: `api.action.setCustomData`.
- Items mutators: `items.register`, `updateDefinition`, `createFromId`.
- Tools mutator: `api.tools.grabber.setSize`.
- Engine-only mutators: `eng.clipboard.set|clear|activate|selectFromHistory`, `eng.coloringTool.setColor|togglePaintBucketMode|toggleMatchColorMode|colorStructure|floodFillColor`, `eng.colorPicker.setActivePalette|togglePalette|closePalette`.
- Cheat flag: `session.cheat.bypassCosts` (write).
