# Input Binding Example

Register Sandkit key bindings and show the bound keys in a small overlay.

## Use

1. Enable the mod and load a save.
2. Press **T** for a toast.
3. Press **O** to hide the overlay panel.
4. Open game settings and rebind the keys — the overlay labels update.

## When to use capture-phase listeners

Sandkit bindings work well for letter keys. Use a capture-phase `keydown` listener (see [`overlay-hotkey`](../overlay-hotkey/)) when the game swallows function keys such as **F7**.

Bindings stay registered for the process lifetime. Hot reload re-runs `main.js` and registers them again.

## Copy this mod

Copy `examples/input-binding/` to `src/<your-mod>/`. Set binding ids, default keys, and handlers in `main.ts`.
