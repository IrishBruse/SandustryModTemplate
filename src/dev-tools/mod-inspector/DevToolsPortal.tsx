import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Interactive, OverlayRoot } from "@modkit/ui";

const PAUSE_Z = 10010;
const DEV_TOOLS_Z = 10020;

type CreatePortal = (children: ReactNode, container: Element) => ReactNode;

function resolveCreatePortal(): CreatePortal | null {
  const fromReact = (
    sandkit.react as { createPortal?: CreatePortal } | undefined
  )?.createPortal;
  if (typeof fromReact === "function") return fromReact;
  const fromDom = (
    globalThis as { ReactDOM?: { createPortal?: CreatePortal } }
  ).ReactDOM?.createPortal;
  if (typeof fromDom === "function") return fromDom;
  return null;
}

/**
 * Pause dimmer is `z-[10010]` on a `#ui` sibling above the inject host (`z-[10005]`).
 * Portal to `document.body` so the panel is not trapped in that stacking context.
 * Falls back to raising the inject host when `createPortal` is missing.
 */
export function DevToolsPortal({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const portal = resolveCreatePortal();

  useLayoutEffect(() => {
    if (portal) {
      const host = document.createElement("div");
      host.setAttribute("data-dev-tools-portal", "1");
      document.body.appendChild(host);
      hostRef.current = host;
      // Force a paint with the host attached; React re-render via state below.
      return () => {
        host.remove();
        hostRef.current = null;
      };
    }

    const dialog = document.querySelector('[aria-label="Dev Tools"]');
    const ui = document.getElementById("ui");
    if (!dialog || !ui) return;
    let host: HTMLElement | null = dialog.parentElement;
    while (host && host.parentElement !== ui) host = host.parentElement;
    if (!host) return;
    const prev = host.style.zIndex;
    host.style.zIndex = String(DEV_TOOLS_Z);
    return () => {
      host!.style.zIndex = prev;
    };
  }, [portal]);

  if (portal) {
    // First pass: host not ready yet — render nothing into inject (avoids flash behind pause).
    if (!hostRef.current) {
      // Mount host synchronously on first commit when possible.
      if (typeof document !== "undefined" && !hostRef.current) {
        const existing = document.querySelector<HTMLDivElement>("[data-dev-tools-portal='1']");
        if (existing) hostRef.current = existing;
        else {
          const host = document.createElement("div");
          host.setAttribute("data-dev-tools-portal", "1");
          document.body.appendChild(host);
          hostRef.current = host;
        }
      }
    }
    if (!hostRef.current) return null;
    return portal(
      <OverlayRoot style={{ zIndex: DEV_TOOLS_Z }}>{children}</OverlayRoot>,
      hostRef.current,
    );
  }

  return (
    <OverlayRoot style={{ zIndex: Math.max(PAUSE_Z + 1, DEV_TOOLS_Z) }}>
      <Interactive>{children}</Interactive>
    </OverlayRoot>
  );
}
