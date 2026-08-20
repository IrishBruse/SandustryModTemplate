import type { CSSProperties, ReactNode } from "react";
import { hotbarSlotBackground } from "../shared/styles";

type HotbarSlotProps = {
  slot: string | number;
  children: ReactNode;
  outlined?: boolean;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
  onClick?: () => void;
};

export function HotbarSlot({
  slot,
  children,
  outlined = false,
  className = "",
  style,
  draggable = false,
  onClick,
}: HotbarSlotProps) {
  return (
    <div
      className={`w-16 h-16 text-white border cursor-pointer flex justify-center items-center shadow-md skew-x-0 relative ring-2 ring-black ring-inset border-slate-200 border-opacity-25 hover:border-opacity-50 active:brightness-125 ${className}`}
      style={{ ...hotbarSlotBackground, ...style }}
      draggable={draggable}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        style={{
          width: 32,
          height: 32,
          overflow: "hidden",
          outline: outlined ? "black solid 2px" : "none",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
        }}
      >
        {children}
      </div>
      <span className="absolute top-0 left-0 text-xs text-white bg-black bg-opacity-50 px-1 rounded-br z-10">
        {slot}
      </span>
    </div>
  );
}

type HotbarIconProps = {
  src: string;
  width?: number;
  height?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
};

/** Pixel-art sprite inside a hotbar slot. */
export function HotbarIcon({
  src,
  width = 16,
  height = 16,
  scale = 2,
  className = "",
  style,
}: HotbarIconProps) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={className}
      style={{
        width,
        height,
        objectFit: "none",
        objectPosition: "left top",
        imageRendering: "pixelated",
        transform: `translate(0px, 0px) scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    />
  );
}
