/**
 * Vanilla resource column inside
 * `#ui > div.fixed… > div.text-white… > div.mb-4`.
 * Do not use `z-[9999]` in `querySelector` — bracket classes are invalid selectors.
 */
export function findResourceStack(): HTMLElement | null {
  const ui = document.querySelector("#ui");
  if (!ui) return null;

  for (const stack of ui.querySelectorAll("div.mb-4")) {
    if (!stack.querySelector(".text-3xl.px-2.text-outline")) continue;

    const column = stack.parentElement;
    if (!column?.classList.contains("text-white")) continue;

    const layer = column.parentElement;
    if (!layer?.classList.contains("fixed")) continue;

    return stack as HTMLElement;
  }

  return null;
}
