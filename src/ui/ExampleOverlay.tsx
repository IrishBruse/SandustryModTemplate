import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const HOTBAR_CLEARANCE = 88;

const shellStyle: CSSProperties = {
  top: 16,
  left: 16,
  right: 16,
  bottom: HOTBAR_CLEARANCE
};

const panelSizeStyle: CSSProperties = {
  width: 1100,
  height: 700,
  maxWidth: "100%",
  maxHeight: "100%"
};

const tabStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  width: 192,
  borderColor: "rgb(255, 231, 0)",
  color: "rgb(255, 231, 0)",
  backgroundImage: "linear-gradient(45deg, rgba(255, 231, 0, 0.15), transparent)"
};

const canvasStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "block"
};

const tabClassName = [
  "text-white bg-black border bg-opacity-25 rounded-tr-md rounded-bl-md",
  "cursor-pointer flex justify-center items-center gap-2 whitespace-nowrap",
  "shadow-md px-2 border-slate-500 overflow-hidden shine-sweep relative"
].join(" ");

export function ExampleOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!event.altKey || event.code !== "KeyD") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen((value) => !value);
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10004] pointer-events-none">
      <div
        className="absolute pointer-events-auto"
        style={shellStyle}
        onClick={() => setOpen(false)}
      />
      <div
        className="fixed flex items-center justify-center pointer-events-none"
        style={shellStyle}
      >
        <div
          className="pointer-events-auto"
          style={panelSizeStyle}
          onClick={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          <div className="h-full bg-black bg-opacity-85 p-4 shadow-lg ui-box card-2 flex flex-col">
            <div className="mb-4 shrink-0">
              <div className="text-white flex gap-2">
                <div className={tabClassName} style={tabStyle}>
                  <div className="tracking-wider">
                    <span>Example Mod</span>
                  </div>
                  <span className="text-outline" style={{ color: "rgb(255, 231, 0)" }}>
                    [Alt+D]
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-grow overflow-hidden min-h-0">
              <canvas style={canvasStyle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
