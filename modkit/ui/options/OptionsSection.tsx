import type { CSSProperties, ReactNode } from "react";

type OptionsSectionProps = {
  title: string;
  /** First section in a panel — no top border. */
  first?: boolean;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Options tab section with uppercase yellow heading and optional intro line. */
export function OptionsSection({
  title,
  first = false,
  description,
  children,
  className = "",
  style,
}: OptionsSectionProps) {
  const titleWrapClass = first ? "pb-1 pt-0" : "pb-1 pt-3 mt-1 border-t border-slate-800/50";

  return (
    <section className={className} style={style}>
      <div className={titleWrapClass}>
        <span className="text-xs font-bold uppercase tracking-widest text-[#ffe700]">{title}</span>
      </div>
      {description ? <p className="text-xs text-slate-300 -mt-1 mb-1">{description}</p> : null}
      {children}
    </section>
  );
}
