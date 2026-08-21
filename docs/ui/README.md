# UI kit

Shared React components under `modkit/ui/`. Import from `@modkit/ui`.

```ts
import { OverlayRoot, FixedAnchor, Interactive, PanelCard } from "@modkit/ui";
```

Each page has a live preview (Storybook-style iframe) plus props and a usage snippet. Browse all previews on the [gallery](gallery.md).

## Components

| Component                      | Page                                                     |
| ------------------------------ | -------------------------------------------------------- |
| `HotkeyBadge`                  | [hotkey-badge.md](hotkey-badge.md)                       |
| `UiBox`                        | [ui-box.md](ui-box.md)                                   |
| `InfoBanner`                   | [info-banner.md](info-banner.md)                         |
| `PanelCard`                    | [panel-card.md](panel-card.md)                           |
| `MenuButton`                   | [menu-button.md](menu-button.md)                         |
| `registerManagementMenuButton` | [management-menu-button.md](management-menu-button.md)   |
| `ManagementMenuButton`         | [management-menu-button.md](management-menu-button.md)   |
| `ResourceRow`                  | [resource-row.md](resource-row.md)                       |
| `SectionHeading`               | [section-heading.md](section-heading.md)                 |
| `ObjectiveCard`                | [objective-card.md](objective-card.md)                   |
| `SecondaryObjectiveRow`        | [secondary-objective-row.md](secondary-objective-row.md) |
| `ObjectiveHighlight`           | [objective-highlight.md](objective-highlight.md)         |
| `ShortcutChip`                 | [shortcut-chip.md](shortcut-chip.md)                     |
| `ShortcutBar`                  | [shortcut-bar.md](shortcut-bar.md)                       |
| `ShortcutBarItem`              | [shortcut-bar-item.md](shortcut-bar-item.md)             |
| `ShortcutBarDivider`           | [shortcut-bar-divider.md](shortcut-bar-divider.md)       |
| `CompoundHotkeys`              | [compound-hotkeys.md](compound-hotkeys.md)               |
| `HotbarSlot`                   | [hotbar-slot.md](hotbar-slot.md)                         |
| `HotbarIcon`                   | [hotbar-icon.md](hotbar-icon.md)                         |
| `OverlayRoot`                  | [overlay-root.md](overlay-root.md)                       |
| `FixedAnchor`                  | [fixed-anchor.md](fixed-anchor.md)                       |
| `Interactive`                  | [interactive.md](interactive.md)                         |

## Shared styles

`@modkit/ui` re-exports `modkit/ui/shared/styles.ts`:

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
import { ACCENT, hotkeyBadgeStyle } from "@modkit/ui";
```

## Tailwind in overlays

The game Tailwind stylesheet is purged. Classes the HUD does not use (for example `w-[28rem]`, `underline`) do nothing until this mod inserts utilities.

The build compiles only class names from files esbuild packed into `main.js`. Sandkit does not load a CSS file, so [src/main.ts](../src/main.ts) still inserts that compiled sheet.

Live canvases live under [docs/ui/canvas](canvas/). `npm run ui:css` compiles Tailwind into [canvas/_preview/utilities.css](canvas/_preview/utilities.css). HUD-only classes (`ui-box`, `hotkey-badge`, `card-2`) stay in [chrome.css](canvas/_preview/chrome.css). See [builds.md](../builds.md).
