import type { CSSProperties, ReactNode } from "react";

type UiBoxProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function UiBox({ children, className = "", style }: UiBoxProps) {
  return (
    <div className={`ui-box ${className}`} style={style}>
      {children}
    </div>
  );
}
