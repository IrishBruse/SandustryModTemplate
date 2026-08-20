# ShortcutBarDivider

A vertical divider line between items in `ShortcutBar`.

**Preview:** [shortcuts/preview.html](../../framework/ui/shortcuts/preview.html)

## Props

This component has no props.

## Usage

```tsx
import { ShortcutBar, ShortcutBarItem, ShortcutBarDivider } from "@framework/ui";

<ShortcutBar>
  <ShortcutBarItem hotkeys="Q" label="Grab" />
  <ShortcutBarDivider />
  <ShortcutBarItem hotkeys="E" label="Use" />
</ShortcutBar>;
```
