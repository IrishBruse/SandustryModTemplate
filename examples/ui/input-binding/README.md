# Input Binding Example

Register a Sandkit key binding and read the bound key with `getDisplayKey`.

## Use

1. Enable the mod.
2. Load a save (or continue).
3. On first load, look for a toast: **Input Binding — press … for a toast** (the key comes from `getDisplayKey`).
4. Press **T** (or your rebound key) for a toast: **Input binding fired**.
5. Open **Options → Controls** and rebind the key. Hot reload or reload the save, then check the load toast and console — the label from `getDisplayKey` matches the new binding.

Open DevTools console on load. You see the binding id and the display key (for example `author.input-binding-example.toast (T)`).

Keys come from Sandkit bindings. Change them in game settings; `getDisplayKey` reflects the active binding.

Sandkit bindings work well for letter keys. Use a capture-phase `keydown` listener (see [`overlay-hotkey`](../overlay-hotkey/)) when the game swallows function keys such as **F7**.

Bindings stay registered for the process lifetime. Hot reload re-runs `main.js` and registers them again.

## Copy this mod

Copy `examples/ui/input-binding/` to `src/<your-mod>/`. Set binding ids, default keys, and handlers in `main.ts`.
