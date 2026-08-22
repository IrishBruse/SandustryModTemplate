# Pixel-perfect Screenshot and GIF recorder

Pixel-perfect PNG and GIF of your **C** selection.

Share a machine, a line, or a whole scene without a blurry screenshot. **Screenshot** copies a **2×** nearest-neighbor PNG. **Record GIF** steps the sim and downloads an animation.

## Use

1. Press **C** and drag a box around the area.
2. Keep that box on screen.
3. Press **F7**.
4. Choose **Screenshot** or **Record GIF**.

| Control        | Action                                                      |
| -------------- | ----------------------------------------------------------- |
| **F7**         | Open or close the panel.                                    |
| **Screenshot** | Copy a **2×** PNG. Paste with **Ctrl+V**.                   |
| **Record GIF** | Record an animated GIF of sim ticks. The `.gif` downloads.  |

## Panel

| Field         | Range  | Default |
| ------------- | ------ | ------- |
| Frames        | 2–120  | 60      |
| Ticks / frame | 1–30   | 1       |
| Greenscreen   | on/off | off     |

**Greenscreen** hides the parallax sky and fills empty pixels with `#00FF00` for chroma key.

**Record GIF** pauses the sim on each painted frame, then steps the ticks you set before the next capture. The GIF is **2×** nearest-neighbor, same as the PNG. Clipboard copy of GIF is attempted; Chromium often rejects `image/gif`.

The dashed **C** marquee is restored after a GIF recording.

## Limits

- The crop is the selection box, plus 1 px on each edge.
- Overlay chrome (handles, HUD) is not in the image.
- A selection that is off-screen cannot be captured. Pan the camera and try again.

## Workshop

`npm run publish` **requires [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)**. It sends [`workshop.txt`](workshop/workshop.txt), [`workshop.json`](workshop/workshop.json), **preview.gif** (or **preview.png**), and images in [`screenshots/`](workshop/screenshots/). Extra screenshots are copied into the uploaded item as `screenshots/`. The build also copies `workshop.json` and the preview to the installed mod root.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
