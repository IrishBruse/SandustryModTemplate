import type { CSSProperties } from "react";

const COLORS = {
  bg: "rgba(0, 0, 0, 0.72)",
  border: "#444",
  text: "#e0e0e0",
  dim: "#888",
  ok: "#7cfc00",
};

const panelStyle: CSSProperties = {
  position: "fixed",
  bottom: "25%",
  right: 12,
  padding: "8px 12px",
  background: COLORS.bg,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 4,
  color: COLORS.text,
  fontFamily: "monospace",
  fontSize: 12,
  zIndex: 9999,
  pointerEvents: "none",
};

export function ExampleStatusPanel() {
  return (
    <div style={panelStyle}>
      <div>author.example-mod</div>
      <div style={{ color: COLORS.ok }}>loaded</div>
    </div>
  );
}
