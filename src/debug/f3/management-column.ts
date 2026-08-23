/** Left management column (resources + menu buttons). Same node as `#ui > div.fixed.z-[9999].pointer-events-none`. */
export const MANAGEMENT_COLUMN_SELECTOR =
  "#ui > div.fixed.z-\\[9999\\].pointer-events-none";

/** Hide the management column while F3 debug is open. Returns restore. */
export function hideManagementColumn(): () => void {
  const el = document.querySelector(MANAGEMENT_COLUMN_SELECTOR);
  if (!(el instanceof HTMLElement)) return () => {};

  const prevVisibility = el.style.visibility;
  el.style.visibility = "hidden";
  return () => {
    el.style.visibility = prevVisibility;
  };
}
