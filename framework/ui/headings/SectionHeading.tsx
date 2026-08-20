import type { CSSProperties, ReactNode } from "react";
import { sectionGradientLeft, sectionGradientRight } from "../shared/styles";

type SectionHeadingProps = {
  children: ReactNode;
  align?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
};

const sizeClass = {
  sm: "text-sm font-light tracking-wider",
  md: "text-xl",
  lg: "text-3xl",
} as const;

export function SectionHeading({
  children,
  align = "left",
  size = "md",
  className = "",
  style,
}: SectionHeadingProps) {
  const alignClass = align === "right" ? "text-right" : "";
  const gradient = align === "right" ? sectionGradientRight : sectionGradientLeft;

  return (
    <h3
      className={`text-white mb-3 text-outline px-2 ${sizeClass[size]} ${alignClass} ${className}`}
      style={{ ...gradient, ...style }}
    >
      {children}
    </h3>
  );
}
