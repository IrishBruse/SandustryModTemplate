# Instant Pick Block

Replaces vanilla **Picker** (default **F**) with Minecraft-style pick block. Vanilla pick logic runs unchanged; a bundle patch fakes a left click when the mod is on.

## Controls

- **F** (or your bound **Picker** key) — pick the structure under the cursor once. No extra click.

Vanilla flow was: hold **F**, left click, release **F**.

## Options

- **Mod enabled** — turn off to restore vanilla Picker (hold to pick) immediately.

Rebind under **Options → Controls → Pick Block**.

## Notes

- Pick rules, filters, colors, and toasts are vanilla — this mod only bypasses the hold-and-click step.
- The shortcut helper may still say “Hold F”; the key now picks on press when the mod is enabled.
- Uses a `js/bundle.js` patch (`patches.ts`). After a game update, rebuild and run tests if the patch fails to apply.

## Workshop

1. Add [`workshop/workshop.md`](workshop/workshop.md) and [`workshop/preview.png`](workshop/preview.png) (or `preview.gif`).
2. Publish:

```bash
npm run publish -- --mod pick-block
```

On the **first** publish, SteamCMD creates the Workshop item (`publishedfileid` `0`) and writes `workshop/workshop.json` with the new item id. Later runs update that item.

SteamCMD uploads from `build/irishbruse.pick-block/` using `workshop.md` for the listing description and [`CHANGELOG.md`](CHANGELOG.md) for change notes at `modinfo.version` (`0.1.0`). See [Workshop publish](../../docs/builds.md#workshop-publish).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
