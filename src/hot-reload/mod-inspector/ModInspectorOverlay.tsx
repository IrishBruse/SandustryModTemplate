import { useEffect, useState, type CSSProperties } from "react";
import { isModInspectorOpen, setModInspectorOpen, subscribeModInspector } from "./state";

const shellStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 10020,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
};

const panelStyle: CSSProperties = {
  width: "min(36rem, calc(100vw - 2rem))",
  minHeight: "12rem",
  padding: "1.25rem 1.5rem",
  color: "#fff",
  backgroundColor: "#000",
  border: "1px solid rgba(226, 232, 240, 1)",
  borderRadius: "0 0.5rem 0 0.5rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.28)",
  fontFamily: '"Consolas", "Liberation Mono", "Courier New", monospace',
};

const titleStyle: CSSProperties = {
  fontSize: "1.5rem",
  letterSpacing: "0.05em",
  marginBottom: "0.75rem",
};

const hintStyle: CSSProperties = {
  fontSize: "0.875rem",
  opacity: 0.75,
};

function isPauseMenuOpen(): boolean {
  const state = sandkit.engine.state as
    | { session?: { windows?: { menu?: { open?: boolean } } } }
    | undefined;
  return state?.session?.windows?.menu?.open === true;
}

/** Blank Mod Inspector panel. Open from pause menu → Mods. Esc closes. */
export function ModInspectorOverlay() {
  const [open, setOpen] = useState(isModInspectorOpen);

  useEffect(() => subscribeModInspector(setOpen), []);

  useEffect(() => {
    if (!open) return;
    const poll = window.setInterval(() => {
      if (!isPauseMenuOpen()) setModInspectorOpen(false);
    }, 200);
    return () => window.clearInterval(poll);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== "Escape" && event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setModInspectorOpen(false);
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  if (!open) return null;

  return (
    <dialog className="top-0 left-0 w-full h-screen pointer-events-none" open>
      <div style={shellStyle} onClick={() => setModInspectorOpen(false)} role="presentation">
        <div
          style={panelStyle}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-label="Mod Inspector"
        >
          <div style={titleStyle}>Mod Inspector</div>
          <p style={hintStyle}>Blank for now. Esc or click outside to close.</p>
        </div>
      </div>
    </dialog>
  );
}
