# Player sprite tint

There is no public Sandkit API to tint the vanilla player body. Mods can reach the Pixi sprites on the main thread while the game scene is active.

## Path

```text
sandkit.state.session.rendering.pixi.sprites.player
```

Useful display objects:

| Key         | Role                                  |
| ----------- | ------------------------------------- |
| `body`      | Player body sprite                    |
| `weapon`    | Equipped weapon sprite                |
| `forearm`   | Forearm overlay                       |
| `container` | Parent container for all player parts |

Each part exposes Pixi `tint` as a packed RGB integer (`0xffffff` is the default white).

## Example

```ts
const playerSprites = (
  sandkit.state.session as {
    rendering?: { pixi?: { sprites?: { player?: { body?: { tint?: number } } } } };
  }
).rendering?.pixi?.sprites?.player;

if (playerSprites?.body && typeof playerSprites.body.tint === "number") {
  playerSprites.body.tint = 0xff6622;
}
```

Reset tint to `0xffffff` when the effect ends so later frames do not keep the colour.

## Notes

- This is **main-thread only** (`main.js`). Workers do not have the renderer session.
- Prefer `sandkit.api.sprites` helpers when you attach **mod-owned** sprites to the player.
- Gameplay mods can use this path for hazard tinting (fire, lava).
