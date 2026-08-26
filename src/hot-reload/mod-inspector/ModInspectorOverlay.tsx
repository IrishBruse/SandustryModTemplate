import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { inGame, safe } from "@modkit/utils";
import { readUiScale } from "./list-mods";
import { ElementsTab } from "./elements/ElementsTab";
import { ModsTab } from "./ModsTab";
import { subscribeMenuOpen } from "./pause-menu";
import { isModInspectorOpen, setModInspectorOpen, subscribeModInspector } from "./state";

const api = sandkit.api;

const PANEL_WIDTH = 980;
const PANEL_HEIGHT = 720;

type TabId = "mods" | "elements" | "recipes";

const TABS: { id: TabId; label: string }[] = [
  { id: "mods", label: "Mods" },
  { id: "elements", label: "Elements" },
  { id: "recipes", label: "Recipes" },
];

function playHover(): void {
  safe(() => api.sound.play("blip", { playbackRate: 4, volume: 0.05 }));
}

function playClick(): void {
  safe(() => api.sound.play("click"));
}

function closePanel(): void {
  playClick();
  setModInspectorOpen(false);
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-[13px] text-slate-400 text-center py-8">{label} — placeholder for now.</p>
    </div>
  );
}

/** Save Game–style Dev Tools panel. Pause **Dev Tools** only. */
export function ModInspectorOverlay() {
  const [open, setOpen] = useState(isModInspectorOpen);
  const [tab, setTab] = useState<TabId>("mods");

  useEffect(() => subscribeModInspector(setOpen), []);

  const show = open && inGame();

  useEffect(() => {
    if (!show) return;
    setTab("mods");
  }, [show]);

  useEffect(() => {
    if (!show) return;
    return subscribeMenuOpen((menuOpen) => {
      if (!menuOpen) setModInspectorOpen(false);
    });
  }, [show]);

  useEffect(() => {
    if (!show) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== "Escape" && event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setModInspectorOpen(false);
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [show]);

  if (!show) return null;

  const scale = readUiScale();

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10010]"
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) closePanel();
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <div
          className="bg-black bg-opacity-90 shadow-lg ui-box card-2 text-white flex flex-col"
          style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT, maxHeight: "80vh" }}
          role="dialog"
          aria-label="Dev Tools"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-5 pt-4 pb-3 border-b border-slate-700/40 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-wide">Dev Tools</h2>
            <button
              type="button"
              className="text-slate-300 hover:text-white transition-colors text-lg leading-none px-1"
              aria-label="Close"
              onClick={closePanel}
              onMouseEnter={playHover}
            >
              ✕
            </button>
          </div>

          <div className="px-5 pt-3 flex justify-center gap-1 border-b border-slate-800">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`
                                    pb-2.5 px-4 text-sm font-medium transition-colors border-b-2
                                    ${
                                      tab === item.id
                                        ? "text-[#ffe700] border-[#ffe700]"
                                        : "text-slate-300 border-transparent hover:text-slate-100"
                                    }
                                `}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="px-5 pt-4 pb-4 flex-1 min-h-0 flex flex-col">
            {tab === "mods" ? <ModsTab /> : null}
            {tab === "elements" ? <ElementsTab /> : null}
            {tab === "recipes" ? <PlaceholderTab label="Recipes" /> : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
