import type { CSSProperties, ReactNode } from "react";

type OptionsButtonProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: () => void;
};

const BUTTON_CLASS =
  "px-3 py-1.5 text-sm bg-black/40 border border-slate-700 rounded-tr-lg rounded-bl-lg text-slate-300 hover:text-[#ffe700] hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-300 disabled:hover:border-slate-700";

/** Secondary action button in the options panel (for example Hide UI). */
export function OptionsButton({
  children,
  className = "",
  style,
  disabled = false,
  onClick,
}: OptionsButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${BUTTON_CLASS} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
