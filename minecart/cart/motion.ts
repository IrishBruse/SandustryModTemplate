export function lerpCell(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  t: number,
): { x: number; y: number } {
  const u = t < 0 ? 0 : t > 1 ? 1 : t;
  return {
    x: fromX + (toX - fromX) * u,
    y: fromY + (toY - fromY) * u,
  };
}
