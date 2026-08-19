/** Main menu Continue button — only rendered when a last save exists. */
export const CONTINUE_BUTTON_ID = "main-menu-continue";

const SETTLE_MS = 250;

let visibleAt = 0;

export function isContinueButtonVisible(): boolean {
  const el = document.getElementById(CONTINUE_BUTTON_ID);
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/** True once the Continue button has been on screen for a short settle period. */
export function isContinueButtonReady(): boolean {
  if (!isContinueButtonVisible()) {
    visibleAt = 0;
    return false;
  }

  if (visibleAt === 0) {
    visibleAt = Date.now();
    return false;
  }

  return Date.now() - visibleAt >= SETTLE_MS;
}

export function resetContinueButtonReady(): void {
  visibleAt = 0;
}

/** Click the main menu Continue button if it is ready. */
export function clickContinueButton(): boolean {
  if (!isContinueButtonReady()) return false;

  const el = document.getElementById(CONTINUE_BUTTON_ID);
  if (!el) return false;

  el.click();
  return true;
}
