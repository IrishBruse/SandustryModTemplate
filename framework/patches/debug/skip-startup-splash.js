// @file js/bundle.js
// @find document.addEventListener("keydown",p),document.addEventListener("click",h);
// @expectedMatches 1

document.addEventListener("keydown", p), document.addEventListener("click", h), requestAnimationFrame(function _skipStartupSplash() {
  document.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  if (!sessionStorage.getItem("splashShown")) requestAnimationFrame(_skipStartupSplash);
});
