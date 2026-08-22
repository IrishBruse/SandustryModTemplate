# Changelog

Notable changes to **Selection Capture**. Newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Added

- **F8** copies a **2×** nearest-neighbor PNG of the **C** marquee.
- Panel **Screenshot** button (same capture as **F8**), under **Record GIF**.
- **F7** opens a panel to record a GIF (frames, ticks per frame, scale).
- README and this changelog (copied into the installed mod folder).

### Removed

- Management-column **Capture** row — open the panel with **F7** only.

### Changed

- GIF **Frames** defaults to **60**.

### Fixed

- GIF frames copy on the first microtask after `frame:render`, so the file is not a solid sky fill.
- The **C** marquee (dashed box and handles) is restored after a GIF recording.

## 0.0.1

First package version in `mod.ts`.
