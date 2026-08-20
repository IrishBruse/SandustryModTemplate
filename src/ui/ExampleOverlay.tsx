import { useEffect, useState } from "react";
import {
  FixedAnchor,
  HotkeyBadge,
  Interactive,
  OverlayRoot,
  SectionHeading,
  UiBox,
} from "@framework/ui";

const TOGGLE_CODE = "KeyE";

export function ExampleOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!event.altKey || event.code !== TOGGLE_CODE) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen((value) => !value);
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  if (!open) return null;

  return (
    <OverlayRoot>
      <FixedAnchor anchor="top-left">
        <Interactive>
          <UiBox className="bg-black bg-opacity-85 p-4 shadow-lg card-2 w-[28rem] text-white">
            <SectionHeading size="md">Example Mod</SectionHeading>
            <p className="text-sm opacity-80 mb-3 underline">
              Replace this overlay with your UI. Tailwind classes and the framework kit both work
              here.
            </p>
            <p className="text-sm flex items-center gap-1">
              Press <HotkeyBadge>Alt</HotkeyBadge>+<HotkeyBadge>E</HotkeyBadge> to close.
            </p>
          </UiBox>
        </Interactive>
      </FixedAnchor>
    </OverlayRoot>
  );
}
