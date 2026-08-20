import type { CSSProperties, ReactNode } from "react";

type PanelCardProps = {
  children: ReactNode;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export function PanelCard({
  children,
  width = 200,
  className = "",
  style,
  onClick,
}: PanelCardProps) {
  return (
    <div
      className={`pointer-events-auto px-3 py-2 rounded-tr-lg rounded-bl-lg bg-black bg-opacity-75 ui-box border border-slate-800 cursor-pointer hover:bg-opacity-90 transition-all relative ${className}`}
      style={{ width, ...style }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
