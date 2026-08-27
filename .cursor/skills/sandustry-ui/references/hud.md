# HUD

Version chip **v0.5.5**. This save: **MAX LEVEL**, viability bar. ComponentIds: **HudTopLeft** (resources column), **HudTopRight** (menu, viability, objectives).

## Top left

Resources: **Credits**, **Fluxite**, **Energy** (icon + count).

Collapse chevron, then rows:

| Label    | Badge | Overlay       |
| -------- | ----- | ------------- |
| Toolbox  | Tab   | `toolbox.md`  |
| Building | Q     | `building.md` |
| Research | T     | `research.md` |
| Upgrades | U     | `upgrades.md` |

Extra rows: `registerManagementMenuButton` (`kit.md`).

**Debug** (`debug.md`). Hidden while DEBUG is open.

**Stats** expand/collapse: Elem, Dmg (Next, Free), % IDs free, Lights static/fx, Structures, Particles, Mouse World/Cell, Heap, SAB (sim/other), Calc, Measured.

## Top right

**Menu [Esc]** (`pause.md`). **Viability**. **Objectives** (story card). **SECONDARY** checklist.

## Bottom center - hotbar

Bank up / n / down. Slots 1-9 and 0. Two empty buttons after 0.

This session: Grabber, Gun, Flamethrower, Signal Button, Conveyor, Launcher, Flare Gun, Filter, Light, Velocity.

Banks: `options.md` **Hotbars**. Keys: `bindings.md` HOTBAR.

## Bottom left - shortcuts

**Hide Shortcuts**. Default chips: Ctrl+Z Undo, Space Hover, E Radial, C Select, X Delete, Middle Click Picker, V Ruler.

## Chrome outside `#ui`

**Toggle Activity Heatmap**, zoom minus / plus.

## Hide UI

**F4**, or Options -> General -> **Hide UI**. **Esc** shows UI again.
