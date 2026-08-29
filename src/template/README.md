# Template

Starter mod in `src/`. Shows a toast when the mod loads. Registers a visible inject probe, a hotbar overlay, and an F13 input binding so renderer hot reload can dispose them.

## Use

1. Enable the mod.
2. Load a save (or continue).
3. Look for the toast: **Template loaded**.
4. Look for **Template inject** at the top-left and **Template hotbar** on the hotbar.
5. Press **F13** for **Template ping**.

Check the console for `[author.template] loaded — template`.

## Edit this mod

Set `id`, `name`, `author`, and `description` in `modinfo.json`. Edit `main.ts` and `ui/Overlay.tsx`.

Copy `src/template/` to `src/<your-mod>/` when you want a second mod.
