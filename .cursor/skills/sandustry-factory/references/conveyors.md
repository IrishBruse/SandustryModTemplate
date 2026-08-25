# Conveyors and launchers

Element transport on structures. Registration is engine-first, mods also use public `structureBehaviors`.

## `sandkit.api.structureBehaviors` (live)

| Method                                                                                                       | Role                                 |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| `registerConveyorType(structureId, options?)`                                                                | Mark structure as conveyor belt      |
| `registerLauncherType({ upType, leftType, rightType, velocity, softDropVelocity, runTickSharedBufferKey? })` | Register up/left/right launcher trio |

`registerConveyorType` options (types): `transportOffset`, `velocity`, `maxTransportDistance`, `transportHeight`, `runWith` (`'left'|'right'`), `skipQueued`.

## `engine.api.conveyors`

| Method                                      | Role                                                   |
| ------------------------------------------- | ------------------------------------------------------ |
| `registerType(state, structureId, options)` | Same as above, posts `RegisterConveyorType` to workers |

Example (burner belt mod, live pattern):

```js
engine.api.conveyors.registerType(state, id, {
  transportOffset: { x: 0, y: -1 },
  velocity: { x: -config.conveyorDefaultSpeed, y: 0 },
  runWith: "left",
  skipQueued: true,
});
```

`__debug.config.conveyorDefaultSpeed`: `0.05` on this build.

## Launchers

No public `sandkit.api.launchers`. Use `structureBehaviors.registerLauncherType` or `engine.api.launchers.registerType`.

Live `state.sandkit.registeredLauncherTypes`:

```js
[
  {
    upType: "launcherUpMk2",
    leftType: "launcherLeftMk2",
    rightType: "launcherRightMk2",
    velocity: [88.8, 88.8],
    softDropVelocity: 45,
    runTickSharedBufferKey: "launcherMk2RunTick",
  },
];
```

Details: **sandustry-entities** `references/launchers.md`.

## Detection

- `sandkit.api.structures.isLauncherAtCell(x, y)` - builtin LauncherUp/Left/Right plus registered launcher types.
- Builtin conveyor cell types also exist in `CellType` (`ConveyorLeft` 19, `ConveyorRight` 20) for terrain grid overlap.

## Shared animation

`shared.conveyorBeltsAnimationIndex` - global belt animation tick (read via state).

## Related

- `store.machineryEngine.runLaunchers` - launcher tick flag on this save: `false`.
- Splitters, droppers, filters: structure types in `enums.md` and UI building list.
