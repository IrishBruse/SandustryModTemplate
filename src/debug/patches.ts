import type { Patch } from "../patches/types";
import { replace } from "../patches/helpers";

/** Dev-only bundle patches (splash skip, etc.). */
export const debugPatches: Patch[] = [
  // First-run splash listens on document click; auto-advance until splashShown is set.
  replace({
    id: "skip-startup-splash",
    file: "js/bundle.js",
    find: 'document.addEventListener("keydown",p),document.addEventListener("click",h);',
    code: 'document.addEventListener("keydown",p),document.addEventListener("click",h),requestAnimationFrame(function _exampleSkipSplash(){document.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0})),sessionStorage.getItem("splashShown")||requestAnimationFrame(_exampleSkipSplash)});',
    expectedMatches: 1,
  }),
];
