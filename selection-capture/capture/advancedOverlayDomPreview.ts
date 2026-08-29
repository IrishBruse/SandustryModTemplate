import { modinfo } from "../modinfo";
import { buildAdvancedOverlayFrameHtml, rasterizeForeignHtml } from "./captureOverlay";
import type { CaptureOverlaySettings } from "./captureSettings";
import { screenRectToViewportRect, type ScreenRect } from "./captureFrame";
import { snapshotOverlayRootHtml } from "./overlayDomSnapshot";

const HOST_ID = `${modinfo.id}:advanced-overlay-preview`;

let lastContentKey = "";

function getHost(): HTMLDivElement {
  let host = document.getElementById(HOST_ID) as HTMLDivElement | null;
  if (!host) {
    host = document.createElement("div");
    host.id = HOST_ID;
    host.style.position = "fixed";
    host.style.pointerEvents = "none";
    host.style.overflow = "hidden";
    host.style.zIndex = "9998";
    host.style.display = "none";
    const frame = document.createElement("div");
    frame.dataset.role = "frame";
    host.appendChild(frame);
    document.body.appendChild(host);
  }
  return host;
}

function getFrame(host: HTMLDivElement): HTMLDivElement {
  return host.querySelector('[data-role="frame"]') as HTMLDivElement;
}

/** Live advanced overlay preview with running CSS animations. */
export function syncAdvancedOverlayDomPreview(
  settings: CaptureOverlaySettings,
  rect: ScreenRect,
): void {
  const html = settings.html.trim();
  if (!settings.enabled || !settings.advanced || !html || rect.width <= 0 || rect.height <= 0) {
    hideAdvancedOverlayDomPreview();
    return;
  }

  const viewport = screenRectToViewportRect(rect);
  if (!viewport) {
    hideAdvancedOverlayDomPreview();
    return;
  }

  const host = getHost();
  const frame = getFrame(host);
  const contentKey = `${rect.width}x${rect.height}:${html}`;

  host.style.display = "block";
  host.style.left = `${viewport.x}px`;
  host.style.top = `${viewport.y}px`;
  host.style.width = `${viewport.width}px`;
  host.style.height = `${viewport.height}px`;

  const scaleX = viewport.width / rect.width;
  const scaleY = viewport.height / rect.height;
  frame.style.width = `${rect.width}px`;
  frame.style.height = `${rect.height}px`;
  frame.style.transformOrigin = "0 0";
  frame.style.transform = `scale(${scaleX}, ${scaleY})`;

  if (contentKey !== lastContentKey) {
    lastContentKey = contentKey;
    frame.innerHTML = buildAdvancedOverlayFrameHtml(html, rect.width, rect.height);
  }
}

/** Rasterize the live animated overlay at crop pixels so GIF/PNG match preview. */
export async function rasterizeLiveAdvancedOverlay(
  width: number,
  height: number,
): Promise<ImageData | null> {
  const host = document.getElementById(HOST_ID) as HTMLDivElement | null;
  if (!host || host.style.display === "none") return null;
  const frame = getFrame(host);
  const root = frame.firstElementChild;
  if (!(root instanceof HTMLElement)) return null;
  void root.offsetWidth;
  const html = await snapshotOverlayRootHtml(root);
  if (!html) return null;
  return rasterizeForeignHtml(html, width, height);
}

export function hideAdvancedOverlayDomPreview(): void {
  lastContentKey = "";
  const host = document.getElementById(HOST_ID);
  if (host) host.style.display = "none";
}
