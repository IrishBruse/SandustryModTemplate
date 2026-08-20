import type { CSSProperties, ReactNode } from "react";
import { objectiveTextShadow } from "../shared/styles";

type SecondaryObjectiveRowProps = {
  children: ReactNode;
  trailing?: ReactNode;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export function SecondaryObjectiveRow({
  children,
  trailing,
  width = 200,
  className = "",
  style,
  onClick,
}: SecondaryObjectiveRowProps) {
  return (
    <div
      className={`mb-1 last:mb-0 py-1 relative pointer-events-auto ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className="relative rounded-r-sm transition-all duration-300 flex items-center justify-between px-2 py-0.5 border-l-2 border-white/20"
        style={{
          width,
          background: "linear-gradient(to right, rgba(0, 0, 0, 0.12), transparent)",
          ...style,
        }}
      >
        <div
          className="text-xs font-bold pr-2 text-white"
          style={{ textShadow: objectiveTextShadow }}
        >
          {children}
        </div>
        {trailing ? (
          <div
            className="flex-shrink-0 text-[10px] font-mono"
            style={{ textShadow: objectiveTextShadow }}
          >
            {trailing}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Inline highlight span for resource names in objective text. */
export function ObjectiveHighlight({
  children,
  color = "rgb(249, 117, 255)",
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span className="font-bold" style={{ color, textShadow: objectiveTextShadow }}>
      {children}
    </span>
  );
}
