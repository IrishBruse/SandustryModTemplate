# Changelog

Notable changes to **Pixel-perfect Screenshot and GIF recorder**. Newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Added

- Panel **Show mouse** toggle — draws the in-game cursor into PNG/GIF when the pointer is inside the selection (default off).
- Panel **Greenscreen** and **Show mouse** use yellow/gray pill toggles.
- Panel **Record GIF** and **Screenshot** buttons show the bound key when one is set in Options.
- Controls bindings for **Toggle panel** (default **F7**), **Screenshot**, and **Record GIF** (empty by default — set keys in Options).

### Changed

- Panel toggle uses `api.input.registerBinding` instead of a capture-phase `keydown` listener.
- Workshop title and `workshop.txt` use **Pixel-perfect Screenshot and GIF recorder** (not Sandshot).
- `npm run publish` keeps real line breaks in the Steam description (no literal `\n`).

## 0.2.0

### Changed

- Display name is **Pixel-perfect Screenshot and GIF recorder** (was Selection Capture). Folder and mod id stay `selection-capture`.
- Workshop description: tagline, steps, features, and limits (`README.md`, `workshop.txt`). Screenshot copies a PNG to the clipboard.
- Workshop **preview.gif** (Steam thumbnail). **preview.png** stays as a still fallback.

## 0.1.1

### Added

- Panel **Screenshot** copies a **2×** nearest-neighbor PNG of the **C** marquee.
- **F7** opens a panel to record a GIF (frames, ticks per frame).
- Panel **Greenscreen** checkbox (PNG and GIF).
- README and this changelog (copied into the installed mod folder).

### Removed

- Management-column **Capture** row — open the panel with **F7** only.
- Panel **Scale** control — PNG and GIF are always **2×** nearest-neighbor.
- **F8** screenshot hotkey — copy a PNG with the panel **Screenshot** button.
- Panel **Freeze background** — installing a cinematic stub froze the game loop.

### Changed

- GIF encode uses **modern-gif** instead of **gifenc**.
- GIF **Frames** defaults to **60**.

### Fixed

- GIF frames copy on the first microtask after `frame:render`, so the file is not a solid sky fill.
- Large GIF crops no longer skip ticks: the sim pauses on paint before the pixel copy, frames are stored as 1× pixels, and a missed paint aborts instead of dropping a frame.
- The **C** marquee (dashed box and handles) is restored after a GIF recording.

## 0.0.1

First package version in `mod.ts`.
