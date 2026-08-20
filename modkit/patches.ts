import { definePatches } from "@modkit/modinfo";

/** Shared debug-only bundle patches. The build merges these into debug `patches.json`. */
export const modkitDebugPatches = definePatches([
  {
    id: "skip-startup-splash",
    file: "js/bundle.js",
    find: 'document.addEventListener("keydown",p),document.addEventListener("click",h);',
    operation: "replace",
    expectedMatches: 1,
    code: `document.addEventListener("keydown", p), document.addEventListener("click", h), requestAnimationFrame(function _skipStartupSplash() {
  document.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  if (!sessionStorage.getItem("splashShown")) requestAnimationFrame(_skipStartupSplash);
});`,
  },
]);
