# Instant Pick Block

Workshop: [Instant Pick Block](https://steamcommunity.com/sharedfiles/filedetails/?id=3789565734).

Replaces vanilla **Picker** (default **F**) with Minecraft-style pick block. Vanilla pick logic runs unchanged; a bundle patch fakes a left click when the mod is on.

## Controls

- **F** (or your bound **Picker** key) — pick the structure under the cursor once. No extra click.

Vanilla flow was: hold **F**, left click, release **F**.

## Options

- **Mod enabled** — turn off to restore vanilla Picker (hold to pick) immediately.

Rebind under **Options → Controls → Pick Block**.

## Notes

- Requires **Sandustry 0.5.5** or newer.
- Pick rules, filters, colors, and toasts are vanilla — this mod only bypasses the hold-and-click step.
- The shortcut helper may still say “Hold F”; the key now picks on press when the mod is enabled.
- Uses a `js/bundle.js` patch (`patches.ts`). After a game update, rebuild and run tests if the patch fails to apply.

## Workshop

`npm run publish` uploads from `build/` with [`workshop.json`](workshop/workshop.json) and **preview.png** (or **preview.gif**). It uses a dedicated [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) cache. [`workshop.md`](workshop/workshop.md) supplies the Steam description. `README.md`, `CHANGELOG.md`, and [`screenshots/`](workshop/screenshots/) stay in the repo. Change notes for Steam come from `CHANGELOG.md` at upload time.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
