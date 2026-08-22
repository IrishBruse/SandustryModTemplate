import type { CSSProperties } from "react";
import { blurRangeOnEscape } from "./sliderKeydown";

type OptionsSliderProps = {
  value: number;
  min: number;
  max: number;
  step?: number | "any";
  onChange: (value: number) => void;
  onStart?: () => void;
  onRelease?: () => void;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

/** Range input with Sandustry `options-slider` chrome. Import `@modkit/ui/options.css`. */
export function OptionsSlider({
  value,
  min,
  max,
  step,
  onChange,
  onStart,
  onRelease,
  className = "",
  style,
  "aria-label": ariaLabel,
}: OptionsSliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(Number(e.target.value))}
      onKeyDown={blurRangeOnEscape}
      onMouseDown={onStart}
      onMouseUp={onRelease}
      className={`options-slider w-40 ${className}`}
      style={style}
    />
  );
}
