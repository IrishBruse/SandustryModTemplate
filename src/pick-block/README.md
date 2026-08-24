# Instant Pick Block

Replaces vanilla **Picker** (default **F**) with Minecraft-style pick block.

## Controls

- **F** (or your bound **Picker** key) — pick the structure under the cursor once. No extra click.

Vanilla flow was: hold **F**, left click, release **F**.

## Options

- **Mod enabled** — turn off to restore vanilla Picker behavior on the next game restart or hot reload.

Rebind under **Options → Controls → Pick Block**.

## Notes

- Empty cells and blocked structures show the same toasts as vanilla.
- Filter, color, and structure data copy rules match vanilla pick block.
- The shortcut helper may still say “Hold F”; the key now picks on press.

## Workshop

1. In Sandustry (**mods** beta), create a Steam Workshop item for this mod and copy the item ID from the URL (`?id=…`).
2. Copy [`workshop/workshop.json.example`](workshop/workshop.json.example) to `workshop/workshop.json` and set `publishedFileId`.
3. Optionally replace [`workshop/preview.png`](workshop/preview.png) with your own screenshot or GIF.
4. Publish:

```bash
npm run publish -- --mod pick-block
```

SteamCMD uploads from `build/pick-block/` using [`workshop.txt`](workshop/workshop.txt) for the listing description and [`CHANGELOG.md`](CHANGELOG.md) for change notes at `modinfo.version` (`0.1.0`). See [Workshop publish](../../docs/builds.md#workshop-publish).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
