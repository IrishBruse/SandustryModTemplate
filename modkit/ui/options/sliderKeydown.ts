import type { KeyboardEvent } from "react";

/** Blur range inputs on Escape and bubble Escape to the document (options panel behavior). */
export function blurRangeOnEscape(e: KeyboardEvent<HTMLInputElement>) {
  if (e.code !== "Escape") return;
  e.currentTarget.blur();
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
  );
}
