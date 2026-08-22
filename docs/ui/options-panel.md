# OptionsPanel

Column wrapper for options tabs. Uses the same Tailwind classes as the in-game Options dialog (`max-w-lg mx-auto px-1`).

**Preview:**

<iframe class="ui-canvas" title="OptionsPanel" src="ui/canvas/options/preview.html?embed=OptionsPanel"></iframe>

## Props

| Prop        | Type            | Default | Description                                                                                                         |
| ----------- | --------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| `children`  | `ReactNode`     | —       | Section content.                                                                                                    |
| `surface`   | `boolean`       | `false` | In-game panel chrome (`ui-box`, `card-2`).                                                                          |
| `center`    | `boolean`       | `false` | Center in a full-width options column.                                                                              |
| `overlay`   | `boolean`       | `false` | HUD layout (no auto margins). With `surface`, opaque fill and Debug-window edges (`rounded-lg`, `border-gray-700`). |
| `className` | `string`        | `""`    | Extra CSS classes.                                                                                                  |
| `style`     | `CSSProperties` | —       | Inline styles.                                                                                                      |

## Usage

```tsx
import { OptionsPanel, OptionsSection, OptionsRow, OptionsSwitch } from "@modkit/ui";

<OptionsPanel surface overlay>
  <OptionsSection title="Gameplay" first>
    <OptionsRow label="Autosave">
      <OptionsSwitch checked={on} onChange={setOn} />
    </OptionsRow>
  </OptionsSection>
</OptionsPanel>;
```
