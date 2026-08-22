import type { CSSProperties, ReactNode } from "react";
import { OptionsSlider } from "./OptionsSlider";

type OptionsSliderRowProps = {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number | "any";
  onChange: (value: number) => void;
  onStart?: () => void;
  onRelease?: () => void;
  formatValue?: (value: number) => ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Slider row with label and value readout (for example UI scale). */
export function OptionsSliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  onStart,
  onRelease,
  formatValue = (v) => `${v}%`,
  className = "",
  style,
}: OptionsSliderRowProps) {
  return (
    <div className={className} style={style}>
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-slate-200 mr-4">{label}</span>
        <div className="flex items-center gap-3">
          <OptionsSlider
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            onStart={onStart}
            onRelease={onRelease}
            aria-label={typeof label === "string" ? label : undefined}
          />
          <span className="text-sm font-medium text-slate-300 w-10 text-right tabular-nums">
            {formatValue(value)}
          </span>
        </div>
      </div>
    </div>
  );
}
