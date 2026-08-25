# DOM and scenes

| Node | Role |
| --- | --- |
| `#canvas` | World |
| `#overlay-canvas` | 2D overlay canvas |
| `#ui` | React HUD and menus |
| Last `body` child | Heatmap, zoom minus / plus |

Typical `#ui` children in **Game**:

| Index | Anchor | Contents |
| --- | --- | --- |
| 0 | full screen, often `display:none` | Hidden debug/perf |
| 1 | `z-[10005]` | Global overlays / toasts |
| 2 | bottom center | Hotbar |
| 3 | top left `z-[9999]` | Resources, management column, Debug / Stats |
| 4 | top center | Notifications |
| 5 | high z | Dialogs / tooltips |
| 6 | top right | Menu, Viability, Objectives |
| 7 | bottom left | Shortcut helper |

Management overlay: `z-[10004]`. Pause dimmer: `z-[10010]`.

`sandkit.enums.Scene`: MainMenu 1, Intro 2, Deploy 3, Game 4. This capture is **Game** after hot-reload auto-load.
