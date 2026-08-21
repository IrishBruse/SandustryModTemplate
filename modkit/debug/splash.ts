/** Startup splash logos in dist/index.html (logo 3 may appear in future builds). */
export const SPLASH_LOGO_IDS = ["splash-logo-1", "splash-logo-2", "splash-logo-3"] as const;

function isSplashLogoVisible(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (parseFloat(style.opacity) < 0.05) return false;

  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/** Dispatch a document click — the game splash handler listens on document. */
export function trySkipSplash(): boolean {
  const logoVisible = SPLASH_LOGO_IDS.some(isSplashLogoVisible);
  const screen = document.getElementById("splash-screen");
  const screenVisible =
    screen !== null &&
    window.getComputedStyle(screen).display !== "none" &&
    SPLASH_LOGO_IDS.some(isSplashLogoVisible);

  if (!logoVisible && !screenVisible) return false;

  document.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, view: window }),
  );
  return true;
}

/** Poll while first-run splash may still be on screen (usually handled by bundle patch). */
export function startSplashSkipPolling(): () => void {
  if (sessionStorage.getItem("splashShown")) return () => {};

  trySkipSplash();
  const deadline = Date.now() + 5000;
  const timer = setInterval(() => {
    trySkipSplash();
    if (sessionStorage.getItem("splashShown") || Date.now() > deadline) clearInterval(timer);
  }, 100);

  return () => clearInterval(timer);
}
