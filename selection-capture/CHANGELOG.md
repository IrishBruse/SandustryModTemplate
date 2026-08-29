# Changelog

## 0.6.0

- Added: live **advanced** overlay preview in the capture box — CSS animations run while the panel is open.
- Added: new advanced-mode starter HTML (sand counter + overflow warning).
- Changed: PNG/GIF advanced overlays snapshot the live preview frame (animations freeze as a still).
- Changed: F7 panel matches the Debug window — title bar, close ✕, drag to move, corner resize (size and position are saved).
- Fixed: advanced capture dropped CSS `counter()` text and clipped layout when baking to SVG.
- Fixed: advanced overlay SVG load failed when CSS used `@property` syntax like `"<integer>"`.
- Fixed: recorded overlay used a different font than the live preview — page fonts are embedded into the SVG bake.

## 0.5.1

- Added: **Overlay** — optional caption on PNG and GIF captures (panel section while F7 is open).
- Added: **Advanced** mode — custom HTML/CSS in a full-size `position: relative` frame; empty advanced HTML loads a starter template.
- Added: simple mode — caption text, font size (8–128), and vertical align (0% top, 100% bottom).
- Added: simple overlay **horizontal** align (0% left, 100% right), same edge rule as vertical.

## 0.5.0

- Added: **Capture area** lock — pin the crop for screenshot and GIF without keeping C select active.
- Added: **Download PNG** under Options → Mods — save a file instead of copying to the clipboard.
- Added: **PNG upscale** and **GIF upscale** under Options → Mods (1–8×, default 1×) — nearest-neighbor upscale after capture.
- Added: **GIF countdown** under Options → Mods (0–10 seconds, default 3). Cancel works during the count.
- Changed: GIF size limit is a dropdown — No limit, 1 MB, or 2 MB (was an on/off 1 MB switch).
- Changed: crop preview only shows while the F7 panel is open (orange for select, locked area, and countdown; red while recording; blue while encoding).
- Changed: screenshot and GIF both use a locked capture area when one is set; otherwise they use the live C selection.
- Changed: no upper limit on GIF frame count (minimum 2).
- Changed: PNG and GIF captures include signal wires and structure hover highlights.

## 0.4.1

- Changed: Record GIF leaves select mode (C) when recording starts. You no longer stay in select mode with an empty selection.

## 0.4.0

- Added: panel 1 MB limit — Record GIF drops frames from the end until the file is at most 1 MiB (Steam Workshop thumbnail size).
- Added: Cancel on the Record button (or the Record GIF key) stops a capture or encode in progress.
- Added: block padding — extra structure blocks around the crop (0 = tight, default 1). Use a higher value when light halos clip.
- Added: capture preview — outline while the F7 panel is open; red while a GIF records or encodes.
- Added: panel settings persist in localStorage (frames, ticks, block padding, greenscreen, show mouse, size limit).
- Changed: structure captures use the structure footprint plus block padding instead of the dashed C marquee, so the crop stays centered.
- Changed: PNG and GIF crops align to whole cell pixels (no extra 1 px border).

## 0.3.0

- Added: Show mouse — draw the in-game cursor into PNG/GIF when the pointer is inside the selection.
- Added: Options bindings for Toggle panel (default F7), Screenshot, and Record GIF. Panel buttons show the bound keys.
- Changed: Record GIF encodes on a worker so the game stays smooth after capture.
- Changed: Record GIF clears the C marquee while recording so you can keep playing. The crop stays the box you selected.
- Changed: panel matches the game options UI (pills, number boxes).

## 0.2.0

- Changed: display name is Pixel-perfect Screenshot and GIF recorder (was Selection Capture). Folder and mod id stay selection-capture.
- Changed: workshop description — tagline, steps, features, and limits. Screenshot copies a PNG to the clipboard.
- Added: workshop preview.gif (Steam thumbnail). preview.png stays as a still fallback.

## 0.1.1

- Added: panel Screenshot copies a 2× nearest-neighbor PNG of the C marquee.
- Added: F7 opens a panel to record a GIF (frames, ticks per frame).
- Added: panel Greenscreen checkbox (PNG and GIF).
- Added: README and this changelog (copied into the installed mod folder).
- Removed: management-column Capture row — open the panel with F7 only.
- Removed: panel Scale control — PNG and GIF are always 2× nearest-neighbor.
- Removed: F8 screenshot hotkey — copy a PNG with the panel Screenshot button.
- Removed: panel Freeze background — installing a cinematic stub froze the game loop.
- Changed: GIF encode uses modern-gif instead of gifenc.
- Changed: GIF Frames defaults to 60.
- Changed: GIF frames copy on the first microtask after frame:render, so the file is not a solid sky fill.
- Changed: large GIF crops no longer skip ticks — the sim pauses on paint before the pixel copy, frames are stored as 1× pixels, and a missed paint aborts instead of dropping a frame.
- Changed: the C marquee (dashed box and handles) is restored after a GIF recording.

## 0.0.1

- Added: first package version.
