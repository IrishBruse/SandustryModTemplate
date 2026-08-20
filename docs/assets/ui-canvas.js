window.smtDocsifyUiCanvasPlugin = function (hook) {
  function measurePreviewHeight(doc) {
    const body = doc.body;
    if (!body) return 0;

    const preview =
      body.querySelector("[data-ui-preview]") ||
      body.querySelector(".preview-block") ||
      body;

    const rect = preview.getBoundingClientRect();
    const styles = doc.defaultView.getComputedStyle(body);
    const padY =
      (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);

    // Box shadows (ui-box / hotkey-badge) sit outside getBoundingClientRect.
    const shadowPad = 56;
    return Math.ceil(Math.max(rect.height + padY + shadowPad, body.scrollHeight, 140));
  }

  function sizeUiCanvas(iframe) {
    try {
      const doc = iframe.contentDocument;
      if (!doc || !doc.body) return;
      iframe.style.height = `${measurePreviewHeight(doc)}px`;
    } catch {
      // Cross-origin canvases stay at min-height.
    }
  }

  function bindUiCanvases() {
    document.querySelectorAll("iframe.ui-canvas").forEach((iframe) => {
      if (iframe.dataset.bound) return;
      iframe.dataset.bound = "1";

      const resize = () => sizeUiCanvas(iframe);
      iframe.addEventListener("load", () => {
        resize();
        // Second pass after fonts / layout settle.
        requestAnimationFrame(() => {
          resize();
          setTimeout(resize, 120);
        });
      });

      if (iframe.contentDocument && iframe.contentDocument.readyState === "complete") {
        resize();
      }
    });
  }

  hook.doneEach(bindUiCanvases);
};
