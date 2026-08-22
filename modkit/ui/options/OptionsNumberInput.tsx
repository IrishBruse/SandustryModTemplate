import type { CSSProperties } from "react";
import { blurRangeOnEscape } from "./sliderKeydown";

type OptionsNumberInputProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number | "any";
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

const NUMBER_CLASS =
  "w-16 px-2 py-1.5 text-sm text-center bg-black/40 text-slate-200 border border-slate-700 rounded-tr-lg rounded-bl-lg focus:border-[#ffe700] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

/** Compact number field for options rows (for example hotbar count). */
export function OptionsNumberInput({
  value,
  min,
  max,
  step,
  onChange,
  disabled = false,
  className = "",
  style,
  "aria-label": ariaLabel,
}: OptionsNumberInputProps) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(e) => {
        const next = Number(e.target.value);
        if (Number.isFinite(next)) onChange(next);
      }}
      onKeyDown={blurRangeOnEscape}
      className={`${NUMBER_CLASS} ${className}`}
      style={style}
    />
  );
}
