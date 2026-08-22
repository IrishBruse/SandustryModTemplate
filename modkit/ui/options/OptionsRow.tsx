import type { CSSProperties, ReactNode } from "react";

type OptionsRowProps = {
  label: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Label (+ optional description) on the left, control on the right. */
export function OptionsRow({
  label,
  description,
  children,
  className = "",
  style,
}: OptionsRowProps) {
  return (
    <div className={`flex items-center justify-between py-2 ${className}`} style={style}>
      <div className="flex flex-col mr-4">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        {description ? <span className="text-xs text-slate-300 mt-0.5">{description}</span> : null}
      </div>
      <div className="flex items-center shrink-0">{children}</div>
    </div>
  );
}
