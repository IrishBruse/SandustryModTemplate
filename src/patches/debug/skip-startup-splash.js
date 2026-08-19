import { replace } from "../../../lib/patches/helpers.ts";

export default replace({
  file: "js/bundle.js",
  find: 'document.addEventListener("keydown",p),document.addEventListener("click",h);',
  code: 'document.addEventListener("keydown",p),document.addEventListener("click",h),requestAnimationFrame(function _exampleSkipSplash(){document.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0})),sessionStorage.getItem("splashShown")||requestAnimationFrame(_exampleSkipSplash)});',
  expectedMatches: 1,
});
