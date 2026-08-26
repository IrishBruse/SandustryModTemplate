# Player Teleport Example

Move the player with `player.setWorldPosition`.

Pattern from workshop mod `dethm0r.teleportplayer`.

## Use

1. Enable the mod and load a save.
2. Point the cursor at a spot in the world.
3. Press **Z** (rebindable under Options → Controls).
4. The player jumps to the cursor.

Hold **Ctrl** to skip the teleport (same guard as the workshop mod).

## Copy this mod

Copy `examples/api/player-teleport/` to `src/<your-mod>/`. Change keys and read a different world position source in `main.ts`.

For camera follow-up, pair with `api.camera.snapToPlayer()` from workshop mod `kpadula.waypoints`.
