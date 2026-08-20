# UI kit

Shared React components under `framework/ui/`. Import from `@framework/ui`.

```ts
import { OverlayRoot, FixedAnchor, Interactive, PanelCard } from "@framework/ui";
```

Each page lists props, a usage snippet, and a link to the matching `preview.html` under `framework/ui/`.

## Components

| Component               | Page                                                     |
| ----------------------- | -------------------------------------------------------- |
| `HotkeyBadge`           | [hotkey-badge.md](hotkey-badge.md)                       |
| `UiBox`                 | [ui-box.md](ui-box.md)                                   |
| `InfoBanner`            | [info-banner.md](info-banner.md)                         |
| `PanelCard`             | [panel-card.md](panel-card.md)                           |
| `MenuButton`            | [menu-button.md](menu-button.md)                         |
| `ResourceRow`           | [resource-row.md](resource-row.md)                       |
| `SectionHeading`        | [section-heading.md](section-heading.md)                 |
| `ObjectiveCard`         | [objective-card.md](objective-card.md)                   |
| `SecondaryObjectiveRow` | [secondary-objective-row.md](secondary-objective-row.md) |
| `ObjectiveHighlight`    | [objective-highlight.md](objective-highlight.md)         |
| `ShortcutChip`          | [shortcut-chip.md](shortcut-chip.md)                     |
| `ShortcutBar`           | [shortcut-bar.md](shortcut-bar.md)                       |
| `ShortcutBarItem`       | [shortcut-bar-item.md](shortcut-bar-item.md)             |
| `ShortcutBarDivider`    | [shortcut-bar-divider.md](shortcut-bar-divider.md)       |
| `CompoundHotkeys`       | [compound-hotkeys.md](compound-hotkeys.md)               |
| `HotbarSlot`            | [hotbar-slot.md](hotbar-slot.md)                         |
| `HotbarIcon`            | [hotbar-icon.md](hotbar-icon.md)                         |
| `OverlayRoot`           | [overlay-root.md](overlay-root.md)                       |
| `FixedAnchor`           | [fixed-anchor.md](fixed-anchor.md)                       |
| `Interactive`           | [interactive.md](interactive.md)                         |

## Shared styles

`@framework/ui` re-exports `framework/ui/shared/styles.ts`:

| Export                 | Role                                   |
| ---------------------- | -------------------------------------- |
| `ACCENT`               | Sandustry yellow `rgb(255, 231, 0)`    |
| `hotkeyBadgeStyle`     | HUD badge background, border, and glow |
| `objectiveTextShadow`  | Text shadow on objective rows          |
| `sectionGradientLeft`  | Left fade for section headings         |
| `sectionGradientRight` | Right fade for section headings        |
| `hotbarSlotBackground` | Radial fill for hotbar slots           |
| `menuButtonShineStyle` | Shine sweep size for menu buttons      |

```ts
import { ACCENT, hotkeyBadgeStyle } from "@framework/ui";
```

## Tailwind in overlays

The game Tailwind stylesheet is purged. Classes the HUD does not use (for example `w-[28rem]`, `underline`) do nothing until this mod inserts utilities.

The build compiles only class names from files esbuild packed into `main.js`. Sandkit does not load a CSS file, so [src/main.ts](../src/main.ts) still inserts that compiled sheet.
