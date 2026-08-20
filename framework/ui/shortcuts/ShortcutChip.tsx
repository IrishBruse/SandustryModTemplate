import type { CSSProperties, ReactNode } from "react";
import { HotkeyBadge } from "../badges/HotkeyBadge";

type ShortcutChipProps = {
  hotkey: ReactNode;
  label: string;
  active?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export function ShortcutChip({
  hotkey,
  label,
  active = false,
  className = "",
  style,
  onClick,
}: ShortcutChipProps) {
  const activeClass = active ? "text-yellow-200 drop-shadow-[0_0_8px_rgba(255,231,0,0.5)]" : "";

  return (
    <div
      className={`flex flex-col items-center gap-1 p-1.5 rounded text-xs border transition-colors pointer-events-auto cursor-pointer bg-black/30 text-white border-white/5 hover:bg-white/10 ${activeClass} ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {typeof hotkey === "string" ? <HotkeyBadge>{hotkey}</HotkeyBadge> : hotkey}
      <span className="opacity-75">{label}</span>
      {active ? (
        <div className="w-1.5 h-1.5 rounded-full bg-[#ffe700] shadow-[0_0_5px_rgba(255,231,0,0.8)] animate-pulse" />
      ) : null}
    </div>
  );
}
