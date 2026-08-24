# Pixel-perfect Screenshot and GIF recorder

**Pixel-perfect PNG and GIF of your C selection.**

Share a machine, a line, or a whole scene without a blurry screenshot. Screenshot copies a 2× nearest-neighbor PNG to the clipboard. Record GIF steps the sim and downloads an animation.

## How to use

1. Press **C** and drag a box around the area (or select structures).
2. Keep the selection on screen.
3. Press **F7** to open the panel.
4. **Screenshot** copies a PNG. Paste with Ctrl+V.
5. **Record GIF** downloads an animated GIF of sim ticks.

Set keys for Screenshot and Record GIF in Options → Controls. The panel shows those keys when bound.

## Features

- 2× nearest-neighbor — sharp pixels, no blur
- GIF of stepped sim ticks (2–120 frames, 1–30 ticks per frame)
- Block padding (0–32) — extra structure blocks around the crop; use 0 for tight, raise when light halos clip
- Greenscreen (#00FF00) for chroma key
- Show mouse — draw the in-game cursor when it is inside the selection
- Optional 1 MB GIF cap for Steam Workshop thumbnails
- Blue crop preview while the panel is open; red while a GIF records or encodes
- Panel settings saved between sessions
- Cancel during GIF capture or encode
- HUD and marquee handles stay out of the image
- Record GIF clears the C selection when it starts so you can keep playing during the capture

## Limits

- The crop follows structure footprints when present, otherwise the marquee content; block padding adds extra structure blocks on every side
- Crops align to whole cell pixels
- A selection that is off-screen cannot be captured — pan the camera and try again
- 1 MB limit cannot fit a GIF if two frames already exceed 1 MiB — crop smaller
