import type { CSSProperties, ReactNode } from "react";
import { HotkeyBadge } from "../badges/HotkeyBadge";
import { menuButtonShineStyle } from "../shared/styles";

type MenuButtonProps = {
  icon: ReactNode;
  label: string;
  hotkey: string;
  highlightLetter?: string;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function MenuButton({
  icon,
  label,
  hotkey,
  highlightLetter,
  width = 208,
  className = "",
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: MenuButtonProps) {
  const letter = highlightLetter ?? label.charAt(0);
  const rest = label.slice(letter.length);

  return (
    <div
      className={`mb-2 relative group cursor-pointer pointer-events-auto ${className}`}
      style={{ width, ...style }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className="w-full text-white bg-black bg-opacity-25 rounded-tr-md rounded-bl-md cursor-pointer flex items-center justify-between shadow-md skew-x-0 active:scale-90 px-4 overflow-hidden before:ease before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 shine-sweep relative left-0 group-hover:left-2"
        style={menuButtonShineStyle}
      >
        <div className="flex items-center overflow-hidden whitespace-nowrap">
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-colors group-hover:text-[#ffe700]">
            {icon}
          </div>
          <div className="tracking-wider" style={{ marginLeft: 12 }}>
            <span className="inline-block whitespace-nowrap">
              <span className="transition-colors group-hover:text-[#ffe700]">{letter}</span>
              {rest}
            </span>
          </div>
        </div>
        <div>
          <span className="inline-block whitespace-nowrap">
            <HotkeyBadge>{hotkey}</HotkeyBadge>
          </span>
        </div>
      </div>
    </div>
  );
}
