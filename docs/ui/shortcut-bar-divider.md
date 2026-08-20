# ShortcutBarDivider

A vertical divider line between items in `ShortcutBar`.

**Preview:**

<iframe class="ui-canvas" title="ShortcutBarDivider" src="ui/canvas/shortcuts/preview.html?embed=ShortcutBarDivider"></iframe>

## Props

This component has no props.

## Usage

```tsx
import { ShortcutBar, ShortcutBarItem, ShortcutBarDivider } from "@modkit/ui";

<ShortcutBar>
  <ShortcutBarItem hotkeys="Q" label="Grab" />
  <ShortcutBarDivider />
  <ShortcutBarItem hotkeys="E" label="Use" />
</ShortcutBar>;
```
