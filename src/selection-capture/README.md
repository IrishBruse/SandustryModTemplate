# Pixel-perfect Screenshot and GIF recorder

Pixel-perfect PNG and GIF of your **C** selection.

Share a machine, a line, or a whole scene without a blurry screenshot. **Screenshot** copies a **2×** nearest-neighbor PNG. **Record GIF** steps the sim and downloads an animation.

## Use

1. Press **C** and drag a box around the area.
2. Keep that box on screen.
3. Press **F7**.
4. Choose **Screenshot** or **Record GIF**.

- **F7** — open or close the panel
- **Screenshot** — copy a **2×** PNG; paste with **Ctrl+V**
- **Record GIF** — record an animated GIF of sim ticks; the `.gif` downloads

Set keys for **Screenshot** and **Record GIF** in Options → Controls. The panel buttons show those keys when bound.

## Panel

- **Frames** — 2–120 (default 60)
- **Ticks / frame** — 1–30 (default 1)
- **Greenscreen** — on/off (default off)
- **Show mouse** — on/off (default off)

**Greenscreen** hides the parallax sky and fills empty pixels with `#00FF00` for chroma key.

**Show mouse** draws the in-game cursor into the PNG or GIF when the pointer tip is inside the selection.

**Record GIF** pauses the sim on each painted frame, then steps the ticks you set before the next capture. After the last frame the sim unpauses and the GIF encodes on a worker so the game stays responsive. The GIF is **2×** nearest-neighbor, same as the PNG. The file downloads.

**Record GIF** clears the dashed **C** marquee when recording starts so you can keep building. The crop stays the box you selected. The marquee is not restored when the GIF finishes.

## Limits

- The crop is the selection box, plus 1 px on each edge.
- Overlay chrome (handles, HUD) is not in the image.
- A selection that is off-screen cannot be captured. Pan the camera and try again.

## Workshop

This mod is published on the Steam Workshop: [Pixel-perfect Screenshot and GIF recorder](https://steamcommunity.com/sharedfiles/filedetails/?id=3787806696).

`npm run publish` uploads from `build/` with [`workshop.json`](workshop/workshop.json) and **preview.gif** (or **preview.png**). It uses [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) on PATH, or downloads Valve's installer into `.tmp/steamcmd/`. [`workshop.txt`](workshop/workshop.txt) supplies the Steam description. `README.md`, `CHANGELOG.md`, and [`screenshots/`](workshop/screenshots/) stay in the repo. Change notes for Steam come from `CHANGELOG.md` at upload time.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
