const STYLE_ID = "dev-tools-crisp-canvas";

/** Nearest-neighbour scaling for the world canvases (sharp when zoomed). */
export function syncCrispCanvas(enabled: boolean): void {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (enabled) {
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = "#canvas,#overlay-canvas{image-rendering:pixelated}";
      document.head.appendChild(style);
    }
    return;
  }
  style?.remove();
}
