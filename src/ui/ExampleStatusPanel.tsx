import type { CSSProperties } from "react";
import React from "../react";
import { inGame, isEnabled } from "../sdk/safe";

const COLORS = {
  accent: "#ff6b4a",
  dim: "#8ba3ba",
  ok: "#7fe0a0",
};

const panelStyle: CSSProperties = {
  position: "fixed",
  right: "12px",
  bottom: "12px",
  zIndex: 2147483646,
  minWidth: "160px",
  padding: "8px 10px",
  background: "rgba(10,13,18,0.94)",
  border: "1px solid rgba(255,107,74,0.35)",
  borderRadius: "5px",
  color: "#e6e2d5",
  font: "11px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace",
  pointerEvents: "none",
  userSelect: "none",
  boxShadow: "0 4px 18px rgba(0,0,0,0.55)",
};

interface ExampleStatusPanelProps {
  retroConsoleRegistered: boolean;
}

export function ExampleStatusPanel({ retroConsoleRegistered }: ExampleStatusPanelProps) {
  if (!isEnabled(sandkit.api) || !inGame()) return null;

  return (
    <div style={panelStyle}>
      <div style={{ color: COLORS.accent, letterSpacing: "0.05em", marginBottom: "4px" }}>
        Example Mod
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <span style={{ color: COLORS.dim }}>retro console</span>
        <span style={{ color: retroConsoleRegistered ? COLORS.ok : COLORS.dim }}>
          {retroConsoleRegistered ? "ready" : "off"}
        </span>
      </div>
    </div>
  );
}
