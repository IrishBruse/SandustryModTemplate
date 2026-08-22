import type { CSSProperties, ReactNode } from "react";

type OptionsPanelProps = {
  children: ReactNode;
  /** Wrap with in-game panel chrome (`ui-box`, `card-2`). */
  surface?: boolean;
  /** Center in a full-width options column (game dialog). */
  center?: boolean;
  /** HUD overlay panel — no auto margins, shrink to content. With `surface`, opaque fill and Debug-window edges (`rounded-lg`, `border-gray-700`). */
  overlay?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Scrollable options column body (`max-w-lg mx-auto px-1`). */
export function OptionsPanel({
  children,
  surface = false,
  center = false,
  overlay = false,
  className = "",
  style,
}: OptionsPanelProps) {
  const layoutClass = overlay ? "" : center ? "max-w-lg mx-auto px-1" : "max-w-lg px-1";
  const surfaceBg = overlay ? "bg-black" : "bg-black/90";
  const surfaceClass = surface
    ? overlay
      ? `${surfaceBg} p-5 text-white border border-gray-700 shadow-lg rounded-lg ui-box card-2`
      : `${surfaceBg} p-5 ui-box card-2 shadow-lg`
    : "";

  return (
    <div className={`${layoutClass} ${surfaceClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
