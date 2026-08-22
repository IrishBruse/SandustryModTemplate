# Retro Game Example

Registers a **Noise Test** game on the Retro Console.

## Use

1. Enable the mod.
2. Open the Retro Console in game.
3. Select **Noise Test**.

| Input | Effect |
| ----- | ------ |
| Left / right | Threshold down / up |
| Up | Toggle animate |
| Down | Change seed |

Display size is 160×100.

## Copy this mod

Copy `src/retro-game-example/` to `src/<your-mod>/`. Change the `registerRetroGame` call in `main.ts`. Set `id`, `name`, `author`, and `description` in `mod.ts`.
