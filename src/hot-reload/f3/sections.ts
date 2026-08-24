import { inGame } from "@modkit/utils";
import { registerF3Section } from "./registry";

const api = sandkit.api;

function fmt(value: number, digits = 1): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}

function cellSize(): number {
  return api.rendering.getGridMetrics().cellSize ?? 4;
}

function worldToCell(x: number, y: number): { x: number; y: number } {
  const size = cellSize();
  return { x: Math.floor(x / size), y: Math.floor(y / size) };
}

/** Built-in F3 sections for the debug companion. Import once at boot. */
export function registerBuiltinF3Sections(): () => void {
  const stops = [
    registerF3Section({
      id: "player",
      title: "Player",
      lines: () => {
        if (!inGame()) return null;

        const pos = api.player.getWorldPosition();
        if (!pos) return null;

        const cell = worldToCell(pos.x, pos.y);
        return [
          { left: "World", right: `${fmt(pos.x)} / ${fmt(pos.y)} px` },
          { left: "Cell", right: `${cell.x} / ${cell.y}` },
        ];
      },
    }),
    registerF3Section({
      id: "mouse",
      title: "Mouse",
      lines: () => {
        if (!inGame()) return null;

        const cell = api.input.getMouseCellPosition();
        if (!cell) return null;

        const size = cellSize();
        const worldX = cell.x * size;
        const worldY = cell.y * size;
        return [
          { left: "Cell", right: `${cell.x} / ${cell.y}` },
          { left: "World", right: `${fmt(worldX)} / ${fmt(worldY)} px` },
        ];
      },
    }),
  ];

  return () => {
    for (const stop of stops) stop();
  };
}
