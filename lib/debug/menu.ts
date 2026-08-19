/** Keyboard-nav id on the main menu — not a DOM id. */
export const CONTINUE_FOCUS_ID = "main-menu-continue";

const SETTLE_MS = 400;

let visibleSince = 0;

function normalizeLabel(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function isContinueLabel(text: string): boolean {
  const label = normalizeLabel(text);
  return label === "continue" || label.endsWith(" continue");
}

/** Find the main-menu Continue row by visible label text. */
export function findContinueButton(): HTMLElement | null {
  const candidates = document.querySelectorAll<HTMLElement>(
    "button, [role='button'], .cursor-pointer, [class*='cursor-pointer']",
  );

  for (const el of Array.from(candidates)) {
    if (!isContinueLabel(el.textContent ?? "")) continue;
    if (el.closest("[aria-hidden='true']")) continue;
    return el;
  }

  return null;
}

function isElementVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;

  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (parseFloat(style.opacity) < 0.05) return false;

  return true;
}

export function isContinueButtonVisible(): boolean {
  const el = findContinueButton();
  return el !== null && isElementVisible(el);
}

/** True once Continue has been visible for {@link SETTLE_MS}. */
export function isContinueButtonReady(): boolean {
  const el = findContinueButton();
  if (!el || !isElementVisible(el)) {
    visibleSince = 0;
    return false;
  }

  const now = Date.now();
  if (visibleSince === 0) {
    visibleSince = now;
    return false;
  }

  return now - visibleSince >= SETTLE_MS;
}

export function resetContinueButtonReady(): void {
  visibleSince = 0;
}

function dispatchClick(el: HTMLElement): void {
  el.click();
  el.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, view: window }),
  );
}

/** Click the main menu Continue button if it is ready. */
export function clickContinueButton(): boolean {
  if (!isContinueButtonReady()) return false;

  const el = findContinueButton();
  if (!el) return false;

  dispatchClick(el);
  return true;
}
