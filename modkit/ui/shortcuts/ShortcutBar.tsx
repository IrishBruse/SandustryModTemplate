import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { HotkeyBadge } from "../badges/HotkeyBadge";

type ShortcutBarProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ShortcutBar({ children, className = "", style }: ShortcutBarProps) {
  return (
    <div
      className={`flex items-center gap-4 bg-black/30 p-2 rounded text-sm text-white border border-white/5 shadow-lg ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

type ShortcutBarItemProps = {
  hotkeys: ReactNode;
  label: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
};

export function ShortcutBarItem({
  hotkeys,
  label,
  active = false,
  className = "",
  onClick,
}: ShortcutBarItemProps) {
  const activeClass = active
    ? "text-yellow-200 drop-shadow-[0_0_8px_rgba(255,231,0,0.5)]"
    : "text-gray-200";

  return (
    <div
      className={`flex items-center gap-2 pointer-events-auto cursor-pointer hover:bg-white/10 rounded px-1 -mx-1 transition-colors ${activeClass} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center gap-1">{hotkeys}</div>
      <span className={active ? "font-medium" : ""}>{label}</span>
      {active ? (
        <div className="w-1.5 h-1.5 rounded-full bg-[#ffe700] shadow-[0_0_5px_rgba(255,231,0,0.8)] animate-pulse" />
      ) : null}
    </div>
  );
}

export function ShortcutBarDivider() {
  return <div className="w-px h-4 bg-white/10" />;
}

/** Renders `Ctrl` + `Z` style compound hotkeys. */
export function CompoundHotkeys({ keys }: { keys: string[] }) {
  return (
    <>
      {keys.map((key, index) => (
        <Fragment key={`${key}-${index}`}>
          {index > 0 ? <span className="opacity-50">+</span> : null}
          <HotkeyBadge>{key}</HotkeyBadge>
        </Fragment>
      ))}
    </>
  );
}
