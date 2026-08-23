import { useEffect, useState } from "react";
import {
  FixedAnchor,
  HotkeyBadge,
  Interactive,
  OverlayRoot,
  SectionHeading,
  UiBox,
} from "@modkit/ui";
import { modinfo } from "../mod";

export const BINDINGS = {
  toast: `${modinfo.id}.toast`,
  togglePanel: `${modinfo.id}.togglePanel`,
} as const;

type OverlayProps = {
  bindings: typeof BINDINGS;
};

export function Overlay({ bindings }: OverlayProps) {
  const [open, setOpen] = useState(true);
  const toastKey = sandkit.api.input.getDisplayKey(bindings.toast, "T");
  const toggleKey = sandkit.api.input.getDisplayKey(bindings.togglePanel, "O");
  const toggleEvent = `${modinfo.id}:toggle-panel`;

  useEffect(() => {
    function onToggle() {
      setOpen((value) => !value);
    }
    window.addEventListener(toggleEvent, onToggle);
    return () => window.removeEventListener(toggleEvent, onToggle);
  }, [toggleEvent]);

  if (!open) return null;

  return (
    <OverlayRoot>
      <FixedAnchor anchor="top-left">
        <Interactive>
          <UiBox className="bg-black bg-opacity-85 p-4 shadow-lg card-2 w-[28rem] text-white">
            <SectionHeading size="md">Input Binding</SectionHeading>
            <p className="text-sm opacity-80 mb-3">
              Keys come from Sandkit bindings. Change them in game settings and the labels update here.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                Press <HotkeyBadge>{toastKey}</HotkeyBadge> for a toast.
              </li>
              <li className="flex items-center gap-2">
                Press <HotkeyBadge>{toggleKey}</HotkeyBadge> to hide this panel.
              </li>
            </ul>
            <p className="text-xs opacity-60 mt-3">
              Use a capture-phase listener when the game swallows function keys (F1–F12). Sandkit bindings are enough for letter keys.
            </p>
          </UiBox>
        </Interactive>
      </FixedAnchor>
    </OverlayRoot>
  );
}

export function InputBindingOverlay() {
  return <Overlay bindings={BINDINGS} />;
}
