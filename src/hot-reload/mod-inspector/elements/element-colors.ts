/** `[r,g,b]` tuple from element definition colors. */
export type Rgb = readonly [number, number, number];

export function rgbToCss(rgb: Rgb): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function metaColorToCss(metaColor: number): string {
  const r = (metaColor >> 16) & 0xff;
  const g = (metaColor >> 8) & 0xff;
  const b = metaColor & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}

/** Pick a readable text color for a swatch background. */
export function contrastText(bg: Rgb | string): string {
  let r: number;
  let g: number;
  let b: number;
  if (typeof bg === "string") {
    const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(bg);
    if (!m) return "#fff";
    r = Number(m[1]);
    g = Number(m[2]);
    b = Number(m[3]);
  } else {
    [r, g, b] = bg;
  }
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#1a1a1a" : "#f8fafc";
}

/** Darken an rgb() fill so tiles sit on the dark Dev Tools panel. */
export function tileFillCss(backgroundCss: string, amount = 0.38): string {
  const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(backgroundCss);
  if (!m) return "rgb(30, 41, 59)";
  const mix = (c: number) => Math.round(c * (1 - amount) + 15 * amount);
  return `rgb(${mix(Number(m[1]))}, ${mix(Number(m[2]))}, ${mix(Number(m[3]))})`;
}
