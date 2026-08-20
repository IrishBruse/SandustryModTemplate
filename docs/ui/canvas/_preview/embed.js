/**
 * When opened as `preview.html?embed=ComponentName`, keep that canvas only.
 * Docsify iframes use this for a Storybook-style isolated preview.
 */
const embed = new URLSearchParams(location.search).get("embed");
if (embed) {
  document.documentElement.classList.add("preview-embed");
  document.body.classList.add("preview-embed");
  for (const el of document.querySelectorAll("[data-ui-preview]")) {
    const name = el.getAttribute("data-ui-preview");
    const block = el.closest(".preview-block");
    if (name !== embed) {
      (block ?? el).remove();
      continue;
    }
    block?.querySelector(".preview-label")?.remove();
  }
}
