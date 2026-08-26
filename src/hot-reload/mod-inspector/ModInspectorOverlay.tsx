import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { inGame, safe } from "@modkit/utils";
import { readUiScale } from "./list-mods";
import { ElementsTab, elementTypeFromClickTarget } from "./elements/ElementsTab";
import { ModsTab } from "./ModsTab";
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

function isPauseMenuOpen(): boolean {
  const state = sandkit.engine.state as
    | { session?: { windows?: { menu?: { open?: boolean } } } }
    | undefined;
  return state?.session?.windows?.menu?.open === true;
}

function closePanel(): void {
  playClick();
  setModInspectorOpen(false);
}

/**
 * Reparent inject output to `document.body` — escapes GlobalOverlays `z-[10005]`.
 * Manual move breaks React delegated clicks, so callers attach native listeners.
 */
function BodyPortal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    document.body.appendChild(node);
    return () => {
      node.remove();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
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
  const [selectedElementType, setSelectedElementType] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeModInspector(setOpen), []);

  const show = open && inGame();

  useEffect(() => {
    if (!show) return;
    setTab("mods");
    setSelectedElementType(null);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const poll = window.setInterval(() => {
      if (!isPauseMenuOpen()) setModInspectorOpen(false);
    }, 200);
    return () => window.clearInterval(poll);
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

  // Native clicks: BodyPortal reparents out of the React root, so delegated onClick dies.
  useEffect(() => {
    if (!show) return;
    const root = rootRef.current;
    if (!root) return;

    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!target) return;

      const actionEl = target.closest("[data-dev-tools-action]") as HTMLElement | null;
      const action = actionEl?.getAttribute("data-dev-tools-action");
      if (action === "close") {
        event.preventDefault();
        event.stopPropagation();
        closePanel();
        return;
      }
      if (action === "backdrop" && event.target === actionEl) {
        event.preventDefault();
        event.stopPropagation();
        closePanel();
        return;
      }

      const tabEl = target.closest("[data-dev-tools-tab]") as HTMLElement | null;
      const nextTab = tabEl?.getAttribute("data-dev-tools-tab");
      if (nextTab === "mods" || nextTab === "elements" || nextTab === "recipes") {
        event.preventDefault();
        event.stopPropagation();
        setTab(nextTab);
        return;
      }

      const elementType = elementTypeFromClickTarget(target);
      if (elementType !== null) {
        event.preventDefault();
        event.stopPropagation();
        setSelectedElementType(elementType);
      }
    }

    function onMouseOver(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!target) return;
      const hit = target.closest("[data-dev-tools-action='close']") as HTMLElement | null;
      if (!hit) return;
      const from = event.relatedTarget as Node | null;
      if (from && hit.contains(from)) return;
      playHover();
    }

    root.addEventListener("click", onClick);
    root.addEventListener("mouseover", onMouseOver);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("mouseover", onMouseOver);
    };
  }, [show]);

  const scale = readUiScale();

  return (
    <BodyPortal>
      {show ? (
        <div
          ref={rootRef}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10010]"
          data-dev-tools-action="backdrop"
          role="presentation"
        >
          <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
            <div
              className="bg-black bg-opacity-90 shadow-lg ui-box card-2 text-white flex flex-col"
              style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT, maxHeight: "80vh" }}
              data-dev-tools-action="dialog"
              role="dialog"
              aria-label="Dev Tools"
            >
              <div className="px-5 pt-4 pb-3 border-b border-slate-700/40 flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-wide">Dev Tools</h2>
                <button
                  type="button"
                  className="text-slate-300 hover:text-white transition-colors text-lg leading-none px-1"
                  aria-label="Close"
                  data-dev-tools-action="close"
                >
                  ✕
                </button>
              </div>

              <div className="px-5 pt-3 flex justify-center gap-1 border-b border-slate-800">
                {TABS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    data-dev-tools-tab={item.id}
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
                {tab === "elements" ? <ElementsTab selectedType={selectedElementType} /> : null}
                {tab === "recipes" ? <PlaceholderTab label="Recipes" /> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </BodyPortal>
  );
}
