/** Interior cell offsets for a side-view sand pile (x right, y up from floor). */
export function cargoPileCells(
  count: number,
  maxCount: number,
  width: number,
  height: number,
): Array<[number, number]> {
  if (count <= 0 || width <= 0 || height <= 0 || maxCount <= 0) return [];

  const fill = Math.min(1, count / maxCount);
  const pileH = Math.max(1, Math.round(height * Math.sqrt(fill)));
  const cells: Array<[number, number]> = [];
  const center = (width - 1) / 2;

  for (let row = 0; row < pileH; row += 1) {
    const rowFromBottom = row + 1;
    const halfW = Math.max(0, Math.floor((width / 2) * fill * (rowFromBottom / pileH)));
    const left = Math.ceil(center - halfW);
    const right = Math.floor(center + halfW);
    for (let x = left; x <= right; x += 1) {
      if (x >= 0 && x < width) cells.push([x, row]);
    }
  }

  return cells;
}
