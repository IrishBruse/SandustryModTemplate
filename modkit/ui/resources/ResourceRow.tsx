import type { CSSProperties, ReactNode } from "react";
import { sectionGradientLeft } from "../shared/styles";

type ResourceRowProps = {
  icon: ReactNode;
  value: ReactNode;
  iconWidth?: number;
  className?: string;
  style?: CSSProperties;
};

export function ResourceRow({
  icon,
  value,
  iconWidth = 24,
  className = "",
  style,
}: ResourceRowProps) {
  return (
    <div
      className={`text-3xl px-2 text-outline ${className}`}
      style={{ ...sectionGradientLeft, ...style }}
    >
      <span
        style={{
          display: "inline-block",
          width: iconWidth,
          fontSize: "0.9em",
          verticalAlign: "text-bottom",
        }}
      >
        {icon}
      </span>
      <div
        style={{
          display: "inline-block",
          transformOrigin: "left center",
          color: "rgb(255, 255, 255)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
