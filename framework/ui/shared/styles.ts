import type { CSSProperties } from "react";

/** Sandustry yellow accent. */
export const ACCENT = "rgb(255, 231, 0)";

/** Shared hotkey badge styling from the game HUD. */
export const hotkeyBadgeStyle: CSSProperties = {
  background: "linear-gradient(rgb(58, 58, 58) 0%, rgb(42, 42, 42) 100%)",
  boxShadow:
    "rgb(26, 26, 26) 0px 2px 0px, rgba(0, 0, 0, 0.4) 0px 3px 6px, rgba(255, 255, 255, 0.1) 0px 1px 0px inset",
  color: ACCENT,
  border: "1px solid rgb(68, 68, 68)",
  fontFamily: "inherit",
  textShadow: "rgba(255, 231, 0, 0.5) 0px 0px 8px",
  pointerEvents: "none",
};

/** Text shadow used on objective rows. */
export const objectiveTextShadow =
  "rgba(0, 0, 0, 0.9) 0px 1px 3px, rgba(0, 0, 0, 0.7) 0px 0px 8px, rgb(0, 0, 0) 0px 0px 2px";

export const sectionGradientLeft: CSSProperties = {
  background: "linear-gradient(to right, rgba(30, 41, 59, 0.25), transparent)",
};

export const sectionGradientRight: CSSProperties = {
  background: "linear-gradient(to left, rgba(30, 41, 59, 0.25), transparent)",
};

export const hotbarSlotBackground: CSSProperties = {
  background: "radial-gradient(circle, rgba(100, 100, 100, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%)",
};

export const menuButtonShineStyle: CSSProperties = {
  height: 42,
  "--shine-sweep-x": "-145px",
} as CSSProperties;
