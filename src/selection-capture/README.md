# Selection Capture

Copy a PNG or record a GIF of a **C** marquee selection.

## Use

1. Press **C** and drag a box around the area.
2. Keep that selection on screen.
3. Choose one:

| Key / control | Action |
| --- | --- |
| **F8** or **Screenshot** | Copy a **2×** PNG (nearest-neighbor). Paste with **Ctrl+V**. |
| **F7** | Open the panel. Click **Record GIF** for an animated GIF. |

## Panel

| Field | Range | Default |
| --- | --- | --- |
| Frames | 2–120 | 60 |
| Ticks / frame | 1–30 | 1 |
| Scale | 1× / 2× / 4× | 2× (nearest) |

**Record GIF** pauses the sim, then steps the ticks you set between frames. The `.gif` downloads. Clipboard copy of GIF is attempted; Chromium often rejects `image/gif`.

**Screenshot** copies a PNG (same as **F8**).

The dashed **C** marquee is restored after a GIF recording.

## Limits

- The crop is the selection AABB, plus 1 px on each edge.
- Overlay chrome (handles, HUD) is not in the image.
- A selection that is off-screen cannot be captured. Pan the camera and try again.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
