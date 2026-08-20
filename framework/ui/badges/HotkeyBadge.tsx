import type { CSSProperties } from "react";
import { hotkeyBadgeStyle } from "../shared/styles";

type HotkeyBadgeProps = {
  children: string;
  className?: string;
  style?: CSSProperties;
};

export function HotkeyBadge({ children, className = "", style }: HotkeyBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 mx-0.5 text-sm font-bold rounded ${className}`}
      style={{ ...hotkeyBadgeStyle, ...style }}
    >
      {children}
    </span>
  );
}
