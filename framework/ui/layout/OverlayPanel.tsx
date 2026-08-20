import type { CSSProperties, ReactNode } from "react";

type OverlayPanelProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Full-screen overlay root — matches `#ui` fixed layers. */
export function OverlayRoot({ children, className = "", style }: OverlayPanelProps) {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-[10005] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

type FixedAnchorProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Screen corner used for transform-origin. */
  anchor?: "top-left" | "top-right" | "bottom-left" | "bottom-center";
  zIndex?: number;
};

const anchorStyle: Record<NonNullable<FixedAnchorProps["anchor"]>, CSSProperties> = {
  "top-left": { top: "1rem", left: "1rem", transformOrigin: "left top" },
  "top-right": { top: "1rem", right: "1rem", transformOrigin: "right top" },
  "bottom-left": { bottom: "1rem", left: "1rem", transformOrigin: "left bottom" },
  "bottom-center": {
    bottom: "1rem",
    left: 0,
    right: 0,
    marginInline: "auto",
    width: "fit-content",
    transformOrigin: "center bottom",
  },
};

/** Fixed HUD anchor with pointer-events-none shell. */
export function FixedAnchor({
  children,
  className = "",
  style,
  anchor = "top-left",
  zIndex = 9999,
}: FixedAnchorProps) {
  return (
    <div
      className={`fixed pointer-events-none ${className}`}
      style={{ zIndex, ...anchorStyle[anchor], ...style }}
    >
      {children}
    </div>
  );
}

/** Wraps interactive children so they receive pointer events inside a pointer-events-none shell. */
export function Interactive({ children, className = "" }: OverlayPanelProps) {
  return <div className={`pointer-events-auto ${className}`}>{children}</div>;
}
