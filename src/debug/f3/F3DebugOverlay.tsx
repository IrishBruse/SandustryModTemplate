import { useEffect, useState, type CSSProperties } from "react";
import { OverlayRoot } from "@modkit/ui";
import { safe } from "@modkit/utils";
import { settingOn } from "../boot/settings";
import { hideManagementColumn } from "./management-column";
import { collectF3Blocks, type F3Block } from "./registry";

const api = sandkit.api;
const TOGGLE_CODE = "F3";

const panelStyle: CSSProperties = {
  position: "fixed",
  top: 8,
  left: 8,
  maxWidth: "min(42rem, calc(100vw - 1rem))",
  padding: "6px 10px",
  backgroundColor: "rgba(0, 0, 0, 0.55)",
  fontFamily: '"Consolas", "Liberation Mono", "Courier New", monospace',
  fontSize: 12,
  lineHeight: 1.35,
  color: "#fff",
  textShadow: "1px 1px 0 #3f3f3f",
  pointerEvents: "none",
  userSelect: "none",
  whiteSpace: "pre",
};

const titleStyle: CSSProperties = {
  color: "#ffff55",
  marginTop: 4,
};

function F3BlockView({ block }: { block: F3Block }) {
  if (block.kind === "blank") return <div style={{ height: 6 }} />;
  if (block.kind === "title") {
    return <div style={titleStyle}>{block.text}</div>;
  }
  if (block.kind === "text") return <div>{block.text}</div>;
  return (
    <div>
      {block.left}: {block.right}
    </div>
  );
}

/** Minecraft-style F3 debug text overlay (extensible via `registerF3Section`). */
export function F3DebugOverlay() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(() => settingOn(api, "engineDebug"));
  const [blocks, setBlocks] = useState<F3Block[]>([]);

  useEffect(() => {
    function refreshSettings(): void {
      const on = settingOn(api, "engineDebug");
      setEnabled(on);
      if (!on) setOpen(false);
    }

    refreshSettings();
    const stop = safe(() => api.settings.onChange(() => refreshSettings()));
    return () => stop?.();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.code !== TOGGLE_CODE && event.key !== "F3") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen((value) => !value);
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [enabled]);

  useEffect(() => {
    if (!open || !enabled) return;
    return hideManagementColumn();
  }, [open, enabled]);

  useEffect(() => {
    if (!open || !enabled) return;

    let frame = 0;
    function tick(): void {
      setBlocks(collectF3Blocks());
      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [open, enabled]);

  if (!open || !enabled) return null;

  return (
    <OverlayRoot>
      <div style={panelStyle} aria-live="polite">
        <div style={{ color: "#aaaaff" }}>Sandustry Debug (F3)</div>
        {blocks.length === 0 ? (
          <div style={{ marginTop: 4, opacity: 0.85 }}>No debug sections (not in-game?)</div>
        ) : (
          blocks.map((block, index) => <F3BlockView key={index} block={block} />)
        )}
      </div>
    </OverlayRoot>
  );
}
