import type { CSSProperties, ReactNode } from "react";
import { HotkeyBadge } from "../badges/HotkeyBadge";
import { menuButtonShineStyle } from "../shared/styles";

type MenuButtonProps = {
  icon: ReactNode;
  label: string;
  hotkey: string;
  highlightLetter?: string;
  width?: number | string;
  /** Column collapsed and this row not hovered (vanilla `a`). */
  collapsed?: boolean;
  className?: string;
  style?: CSSProperties;
  rowProps?: Record<string, string>;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/** Vanilla framer: `transition: { duration: 0.2, ease: "easeInOut" }`. */
const TWEEN = "0.2s ease-in-out";

function detailStyle(collapsed: boolean, withMargin: boolean): CSSProperties {
  return {
    opacity: collapsed ? 0 : 1,
    width: collapsed ? 0 : "auto",
    maxWidth: collapsed ? 0 : 160,
    minWidth: collapsed ? 0 : undefined,
    overflow: "hidden",
    ...(withMargin ? { marginLeft: collapsed ? 0 : 12 } : {}),
    transition: `opacity ${TWEEN}, width ${TWEEN}, max-width ${TWEEN}, margin-left ${TWEEN}`,
  };
}

export function MenuButton({
  icon,
  label,
  hotkey,
  highlightLetter,
  width = 208,
  collapsed = false,
  className = "",
  style,
  rowProps,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: MenuButtonProps) {
  const letter = highlightLetter ?? label.charAt(0);
  const rest = label.slice(letter.length);
  const widthStyle = typeof width === "number" ? `${width}px` : width;

  return (
    <div
      {...rowProps}
      className={`mb-2 relative group cursor-pointer pointer-events-auto ${className}`}
      style={{
        width: widthStyle,
        transition: `width ${TWEEN}`,
        ...style,
      }}
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
          <div className="tracking-wider" style={detailStyle(collapsed, true)}>
            <span className="inline-block whitespace-nowrap">
              <span className="transition-colors group-hover:text-[#ffe700]">{letter}</span>
              {rest}
            </span>
          </div>
        </div>
        <div style={detailStyle(collapsed, false)}>
          <span className="inline-block whitespace-nowrap">
            <HotkeyBadge className="!mx-0">{hotkey}</HotkeyBadge>
          </span>
        </div>
      </div>
    </div>
  );
}
