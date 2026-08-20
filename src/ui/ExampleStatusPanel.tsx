import type { CSSProperties } from "react";

const COLORS = {
  bg: "rgba(0, 0, 0, 0.72)",
  border: "#444",
  text: "#e0e0e0",
  dim: "#888",
  ok: "#7cfc00"
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
  pointerEvents: "none"
};

export function ExampleStatusPanel() {
  return (
    <div style={panelStyle}>
      <li>test</li>
      <table>
        <tr>
          <th>Test</th>
          <th>Contact</th>
          <th>Country</th>
        </tr>
        <tr>
          <td>Alfreds Futterkiste</td>
          <td>Maria Anders</td>
          <td>Germany</td>
        </tr>
        <tr>
          <td>Centro comercial Moctezuma</td>
          <td>Francisco Chang</td>
          <td>Mexico</td>
        </tr>
      </table>
      <div>author.example-mod</div>
      <div style={{ color: COLORS.ok }}>loaded</div>
    </div>
  );
}
