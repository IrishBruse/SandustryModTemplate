# Changelog

Notable changes to **Selection Capture**. Newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

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
