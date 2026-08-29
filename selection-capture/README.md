# Screenshot and GIF recorder

Workshop: [Screenshot and GIF recorder](https://steamcommunity.com/sharedfiles/filedetails/?id=3787806696).

Pixel-perfect PNG and GIF of your **C** selection.

Share a machine, a line, or a whole scene without a blurry screenshot. **Screenshot** copies a nearest-neighbor PNG. **Record GIF** steps the sim and downloads an animation.

## Use

1. Press **C** and drag a box around the area (or select structures).
2. Keep the selection on screen.
3. Press **F7**. Drag the title bar to move the panel; drag the bottom-right corner to resize.
4. Choose **Screenshot** or **Record GIF**. Optional: **Lock** capture area first so you can clear **C** select and still capture that box.

- **F7** — open or close the panel (title-bar ✕ also closes)
- **Screenshot** — copy a PNG; paste with **Ctrl+V** (or download — see **Options → Mods**)
- **Record GIF** — record an animated GIF of sim ticks; the `.gif` downloads

Set keys for **Screenshot** and **Record GIF** in Options → Controls. The panel buttons show those keys when bound.

## Panel

- **Frames** — minimum 2 (default 60). No upper limit.
- **Ticks / frame** — 1–30 (default 1)
- **Block padding** — 0–32 (default 1). Extra structure blocks around the crop. Use **0** for a tight crop. Raise it when light halos clip.
- **Greenscreen** — on/off (default off)
- **Show mouse** — on/off (default off)
- **GIF size limit** — **No limit**, **1 MB**, or **2 MB** (default no limit). Record GIF keeps the longest prefix that stays under the cap.
- **Overlay** — optional caption on PNG/GIF. Simple mode: text, font size, vertical and horizontal align. Advanced mode: custom HTML/CSS with a live animated preview in the capture box (PNG/GIF freeze the current frame).

Panel settings are saved between sessions.

**GIF countdown** — 0–10 seconds before Record GIF starts (default 3). Set under **Options → Mods**. **0** starts at once. Cancel works during the count.

**Download PNG** — under **Options → Mods**, save a PNG file instead of copying to the clipboard. The panel button switches between **Copy PNG** and **Download PNG**.

**PNG upscale** and **GIF upscale** — under **Options → Mods**, nearest-neighbor upscale after capture (1–8, default 1). Separate settings for screenshot and GIF.

While the panel is open, an **orange** outline shows the live **C** selection and a locked capture area. During GIF capture the outline turns **red**; during encode it turns **blue**. The countdown stays **orange**. Close the panel (F7) to hide all outlines.

**Greenscreen** hides the parallax sky and fills empty pixels with `#00FF00` for chroma key.

**Show mouse** draws the in-game cursor into the PNG or GIF when the pointer tip is inside the selection.

**GIF size limit** encodes the captured frames, then drops frames from the end until the `.gif` fits the cap (**1 MB** or **2 MB**). Use **1 MB** for Steam Workshop thumbnails. If even two frames are over the cap, crop a smaller box.

**Screenshot** and **Record GIF** both use a locked capture area when one is set; otherwise they use the live **C** selection. **Record GIF** waits for the **Countdown**, then pauses the sim on each painted frame and steps the ticks you set before the next capture. Use **Capture area** to pin the crop from your current **C** selection — you can clear select and keep building while the panel stays open and the orange outline shows. After the last frame the sim unpauses and the GIF encodes on a worker so the game stays responsive. Set **PNG upscale** / **GIF upscale** under **Options → Mods** (default 1×). The file downloads. The row shows the countdown, then **Recording…** and **Encoding…**. The button is **Cancel** in all of those cases.

**Record GIF** exits **C** select mode when recording starts (clears the selection and restores the normal cursor) so you can keep building. The crop stays the box you selected. Select mode is not restored when the GIF finishes.

## Limits

- The crop follows selected structure footprints when present, otherwise the marquee content. **Block padding** adds extra structure blocks on every side. Crops align to whole cell pixels.
- Overlay chrome (handles, HUD) is not in the image. Signal wires and structure hover highlights on the overlay canvas are included.
- A selection that is off-screen cannot be captured. Pan the camera and try again.

## Workshop

This mod is published on the Steam Workshop: [Pixel-perfect Screenshot and GIF recorder](https://steamcommunity.com/sharedfiles/filedetails/?id=3787806696).

This mod has its own `package.json`. After a clone, run `npm install` in `src/selection-capture/` (root `npm install` does not).

`npm run publish` uploads from `build/` with [`workshop.json`](workshop/workshop.json) and **preview.gif** (or **preview.png**). It uses a dedicated [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) cache. [`workshop.md`](workshop/workshop.md) supplies the Steam description. `README.md`, `CHANGELOG.md`, and [`screenshots/`](workshop/screenshots/) stay in the repo. Change notes for Steam come from `CHANGELOG.md` at upload time.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
