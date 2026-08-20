import type { CSSProperties, ReactNode } from "react";

type ObjectiveCardProps = {
  category: string;
  title: string;
  icon?: ReactNode;
  categoryClassName?: string;
  className?: string;
  style?: CSSProperties;
};

export function ObjectiveCard({
  category,
  title,
  icon,
  categoryClassName = "text-purple-400",
  className = "",
  style,
}: ObjectiveCardProps) {
  return (
    <div
      className={`relative w-[200px] overflow-hidden px-3 py-2.5 transition-all duration-500 ${className}`}
      style={{
        borderRadius: "0px 8px",
        background: "rgba(0, 0, 0, 0.6)",
        ...style,
      }}
    >
      {icon ? <div className="absolute right-2 top-2 opacity-60">{icon}</div> : null}
      <div className="relative z-10 flex flex-col gap-1 pr-5">
        <div className="flex items-center">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${categoryClassName}`}>
            {category}
          </span>
        </div>
        <span className="text-sm font-medium leading-snug text-white/90">{title}</span>
      </div>
    </div>
  );
}
