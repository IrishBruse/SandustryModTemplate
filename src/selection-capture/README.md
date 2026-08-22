# Selection Capture

Copy a PNG or record a GIF of a **C** marquee selection.

## Use

1. Press **C** and drag a box around the area.
2. Keep that selection on screen.
3. Choose one:

| Key | Action |
| --- | ------ |
| **F8** | Copy a **2×** PNG (nearest-neighbor). Paste with **Ctrl+V**. |
| **F7** | Open the GIF panel. Click **Record GIF**. |

The left management column has a **Capture** row (**F7**).

## GIF panel

| Field | Range | Default |
| ----- | ----- | ------- |
| Frames | 2–120 | 60 |
| Ticks / frame | 1–30 | 1 |
| Scale | 1× / 2× / 4× | 2× (nearest) |

The sim pauses, then steps the ticks you set between frames. The `.gif` downloads. Clipboard copy of GIF is attempted; Chromium often rejects `image/gif`.

The dashed **C** marquee is restored after the recording.

## Limits

- The crop is the selection AABB, plus 1 px on each edge.
- Overlay chrome (handles, HUD) is not in the image.
- A selection that is off-screen cannot be captured. Pan the camera and try again.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
