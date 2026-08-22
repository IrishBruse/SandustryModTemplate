import type { CSSProperties } from "react";

type OptionsSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Dark ring style for dense panels (mod config). */
  subtle?: boolean;
  className?: string;
  style?: CSSProperties;
};

const SWITCH_BASE =
  "relative inline-flex items-center cursor-pointer w-10 h-[22px] rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-200 after:shadow-sm";

/** Pill toggle used in the game options panel. */
export function OptionsSwitch({
  checked,
  onChange,
  disabled = false,
  subtle = false,
  className = "",
  style,
}: OptionsSwitchProps) {
  const stateClass = checked
    ? subtle
      ? "bg-black ring-1 ring-inset ring-[#ffe700] after:bg-[#ffe700] after:translate-x-[18px]"
      : "bg-[#ffe700] after:bg-white after:translate-x-[18px]"
    : subtle
      ? "bg-black ring-1 ring-inset ring-slate-600 after:bg-slate-600"
      : "bg-slate-700 after:bg-white";

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div
      role="switch"
      aria-checked={checked}
      className={`${SWITCH_BASE} ${stateClass} ${disabledClass} ${className}`}
      style={style}
      onClick={() => {
        if (disabled) return;
        onChange(!checked);
      }}
    />
  );
}
