import { FixedAnchor, OverlayRoot } from "@modkit/ui";

export const INJECT_PROBE = "Template inject";
export const HOTBAR_PROBE = "Template hotbar";

/** Always-on HUD marker so renderer hot reload can be checked on screen. */
export function TemplateOverlay() {
  return (
    <OverlayRoot>
      <FixedAnchor anchor="top-left" zIndex={20000}>
        <div
          data-hot-reload-probe="inject"
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 20000,
            pointerEvents: "none",
            color: "#fff",
            fontSize: 12,
            textShadow: "0 1px 2px #000",
          }}
        >
          {INJECT_PROBE}
        </div>
      </FixedAnchor>
    </OverlayRoot>
  );
}

export function renderHotbar() {
  return (
    <div
      data-hot-reload-probe="hotbar"
      style={{ color: "#fff", fontSize: 11, textShadow: "0 1px 2px #000" }}
    >
      {HOTBAR_PROBE}
    </div>
  );
}
