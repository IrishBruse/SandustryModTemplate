# Launchers

Structure launchers (Up / Left / Right) fling elements from conveyors.
Not the same as `entities.launch` (critter toss).

## Registration

`sandkit.engine.api.launchers.registerType(state, config)` - called at mod init.

Example config (mk2, live):

```js
{
  upType: "launcherUpMk2",
  leftType: "launcherLeftMk2",
  rightType: "launcherRightMk2",
  velocity: [88.8, 88.8],
  softDropVelocity: 45,
  runTickSharedBufferKey: "launcherMk2RunTick"
}
```

- `upType` / `leftType` / `rightType` - structure ids registered in `sandkit.mods.structures`.
- `velocity` - launch speed pair.
- `softDropVelocity` - gentle drop speed.
- `runTickSharedBufferKey` - shared worker buffer for tick sync.

## State

Registered types also appear in `state.sandkit.registeredLauncherTypes[]` (mirror of registrations).

## Related

- Built-in `StructureType.LauncherUp` (5), `LauncherLeft` (6), `LauncherRight` (7).
- Conveyor behavior: `sandkit.api.structureBehaviors` and `engine.api.conveyors.registerType`.
- Worker trigger `launchersMk2` fires on interval to stamp run tick into shared buffer.

No public `sandkit.api.launchers`.
Engine-only registration.
