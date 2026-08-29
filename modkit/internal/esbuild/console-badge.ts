/** DevTools `%c` badge styles by severity (Chromium console). */

export type ConsoleBadgeLevel = "log" | "info" | "warn" | "error" | "debug";

export function badgeCss(level: ConsoleBadgeLevel): string {
  const palette: Record<ConsoleBadgeLevel, { bg: string; fg: string; border: string }> = {
    log: { bg: "#0b1220", fg: "#7dd3fc", border: "#38bdf8" },
    info: { bg: "#0b1220", fg: "#7dd3fc", border: "#38bdf8" },
    warn: { bg: "#1a1205", fg: "#fbbf24", border: "#f59e0b" },
    error: { bg: "#1f0808", fg: "#fca5a5", border: "#ef4444" },
    debug: { bg: "#111827", fg: "#9ca3af", border: "#6b7280" },
  };
  const { bg, fg, border } = palette[level];
  return [
    `background:${bg}`,
    `color:${fg}`,
    `border:1px solid ${border}`,
    "padding:1px 7px",
    "border-radius:4px",
    "font-weight:700",
    "font-size:11px",
    "font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
    "letter-spacing:0.03em",
  ].join(";");
}
