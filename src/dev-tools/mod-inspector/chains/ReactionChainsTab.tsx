import { useEffect, useMemo, useState } from "react";
import { elementSourceLabel } from "../mod-source";
import { ElementPixel } from "../elements/ElementPixel";
import { contrastText, tileFillCss } from "../elements/element-colors";
import type { ElementRow } from "../elements/list-elements";
import { FlowList } from "./ChainFlows";
import { buildChainIndex, elementStepCount, type ChainIndex, type ChainStep } from "./chain-index";
import { clearLiveEngineRecipesCache, loadLiveEngineRecipes } from "./live-engine-recipes";
import { flowBlurb, stepsFor } from "./chain-tree";
import { KIND_COLOR, KIND_LABEL, type ReactionKind } from "./step-icons";

const ALL_KINDS: ReactionKind[] = ["contact-mix", "element-mix", "machine", "burn", "structure"];

type Selection =
  | { kind: "step"; step: ChainStep; elementType: number; path: string }
  | { kind: "element"; elementType: number }
  | null;

function chanceText(chance: number | undefined): string | null {
  if (chance == null || !(chance < 1)) return null;
  return `${Math.round(chance * 100)}%`;
}

function elementLabel(index: ChainIndex, type: number): string {
  return index.elements.get(type)?.name ?? `type ${type}`;
}

function PickerRow({
  element,
  count,
  selected,
  onSelect,
}: {
  element: ElementRow;
  count: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-2 px-2 py-1.5 text-left border transition-colors ${
        selected
          ? "border-[#ffe700] text-[#ffe700] bg-black"
          : "border-transparent text-white hover:border-slate-600 hover:bg-black/40"
      }`}
      style={{ borderRadius: 0 }}
    >
      <ElementPixel element={element} size={16} />
      <span className="flex-1 min-w-0">
        <span className="block text-[12px] font-semibold truncate leading-tight">
          {element.name}
        </span>
        <span className="block text-[10px] font-mono text-slate-500 truncate leading-tight">
          {element.id}
        </span>
      </span>
      {count > 0 ? (
        <span className="text-[10px] tabular-nums text-slate-400 shrink-0">{count}</span>
      ) : (
        <span className="text-[10px] text-slate-600 shrink-0">—</span>
      )}
    </button>
  );
}

function RootHeader({
  element,
  crumb,
  doesBlurb,
  fromBlurb,
  onBack,
}: {
  element: ElementRow | undefined;
  crumb: number[];
  doesBlurb: string;
  fromBlurb: string;
  onBack: () => void;
}) {
  if (!element) {
    return (
      <div className="shrink-0 px-3 py-3 border-b border-slate-600">
        <p className="text-[12px] text-slate-500">Pick an element to explore chains.</p>
      </div>
    );
  }
  const fill = tileFillCss(element.backgroundCss);
  const ink = contrastText(fill);
  return (
    <div className="shrink-0 px-3 py-2.5 border-b border-slate-600 flex items-start gap-3">
      {crumb.length > 0 ? (
        <button
          type="button"
          onClick={onBack}
          className="text-[11px] text-slate-400 hover:text-[#ffe700] shrink-0 mt-1"
        >
          ← Back
        </button>
      ) : null}
      <span
        className="shrink-0 border border-black/50 flex items-center justify-center gap-1 text-[10px] font-mono font-bold"
        style={{ width: 48, height: 36, backgroundColor: fill, color: ink }}
      >
        <ElementPixel element={element} size={14} />
        {element.elementType}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-[#ffe700] truncate leading-tight">
          {element.name}
        </p>
        <p className="text-[11px] text-slate-200 leading-snug mt-1">{doesBlurb}</p>
        <p className="text-[11px] text-slate-400 leading-snug">{fromBlurb}</p>
      </div>
    </div>
  );
}

function SelectionPanel({ index, selection }: { index: ChainIndex; selection: Selection }) {
  if (!selection) {
    return (
      <div className="px-3 py-3">
        <p className="text-[11px] text-slate-500">Select a recipe.</p>
      </div>
    );
  }

  const elementType = selection.kind === "element" ? selection.elementType : selection.elementType;
  const element = index.elements.get(elementType);
  const step = selection.kind === "step" ? selection.step : null;

  return (
    <div className="px-3 py-3 space-y-3 overflow-y-auto flex-1 min-h-0 text-[11px]">
      {step ? (
        <div>
          <p className="text-[13px] font-semibold text-[#ffe700] mb-1">{step.label}</p>
          <p className="mb-2" style={{ color: KIND_COLOR[step.kind] }}>
            {KIND_LABEL[step.kind]}
          </p>
          {step.iconSrc ? (
            <img
              src={step.iconSrc}
              alt=""
              width={32}
              height={32}
              className="mb-2"
              style={{
                width: 32,
                height: 32,
                objectFit: "cover",
                objectPosition: "top left",
                imageRendering: "pixelated",
              }}
            />
          ) : null}
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Inputs</p>
          <ul className="space-y-0.5 mb-2 text-slate-200">
            {step.inputs.map((type) => (
              <li key={`in-${type}`}>{elementLabel(index, type)}</li>
            ))}
            {step.inputs.length === 0 ? <li className="text-slate-500">—</li> : null}
          </ul>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Outputs</p>
          <ul className="space-y-0.5 text-slate-200">
            {step.outputs.map((out) => {
              const pct = chanceText(out.chance);
              return (
                <li key={`out-${out.elementType}`}>
                  {elementLabel(index, out.elementType)}
                  {pct ? ` (${pct})` : ""}
                </li>
              );
            })}
            {step.outputs.length === 0 ? <li className="text-slate-500">— (sink)</li> : null}
          </ul>
        </div>
      ) : null}

      {element ? (
        <div className={step ? "border-t border-slate-700 pt-3" : ""}>
          <p className="text-[12px] font-semibold text-white mb-1">{element.name}</p>
          <p className="text-slate-400 mb-1">
            {elementSourceLabel(element.source)} · {element.matterLabel}
          </p>
          <div className="grid grid-cols-1 gap-0.5 text-slate-300">
            <p>
              <span className="text-slate-500">Id </span>
              <span className="font-mono">{element.id}</span>
            </p>
            <p>
              <span className="text-slate-500">Type # </span>
              <span className="font-mono">{element.elementType}</span>
            </p>
            <p>
              <span className="text-slate-500">Density </span>
              {element.density}
            </p>
            {element.collectorValue > 0 ? (
              <p>
                <span className="text-slate-500">Collector </span>
                {element.collectorValue}
              </p>
            ) : null}
            {element.modId ? (
              <p>
                <span className="text-slate-500">Mod </span>
                {element.modId}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ReactionChainsTab() {
  const [index, setIndex] = useState<ChainIndex>(() => buildChainIndex());
  const [liveReady, setLiveReady] = useState(false);
  const [query, setQuery] = useState("");
  const [rootType, setRootType] = useState<number | null>(null);
  const [crumb, setCrumb] = useState<number[]>([]);
  const [enabled, setEnabled] = useState(() => new Set<ReactionKind>(ALL_KINDS));
  const [maxDepth, setMaxDepth] = useState(1);
  const [selection, setSelection] = useState<Selection>(null);

  useEffect(() => {
    let cancelled = false;
    void loadLiveEngineRecipes().then(() => {
      if (cancelled) return;
      setIndex(buildChainIndex());
      setLiveReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshIndex() {
    clearLiveEngineRecipesCache();
    setLiveReady(false);
    await loadLiveEngineRecipes(true);
    setIndex(buildChainIndex());
    setLiveReady(true);
  }

  const elementList = useMemo(() => {
    const rows = [...index.elements.values()];
    const q = query.trim().toLowerCase();
    const filtered = !q
      ? rows
      : rows.filter(
          (el) =>
            el.name.toLowerCase().includes(q) ||
            el.id.toLowerCase().includes(q) ||
            String(el.elementType).includes(q),
        );
    return filtered.sort((a, b) => {
      const ca = elementStepCount(index, a.elementType);
      const cb = elementStepCount(index, b.elementType);
      if (ca !== cb) return cb - ca;
      return a.elementType - b.elementType;
    });
  }, [index, query]);

  const doesCount = rootType == null ? 0 : stepsFor(index, rootType, "down", enabled).length;
  const fromCount = rootType == null ? 0 : stepsFor(index, rootType, "up", enabled).length;
  const doesBlurb = rootType == null ? "" : flowBlurb(index, rootType, "down", enabled);
  const fromBlurb = rootType == null ? "" : flowBlurb(index, rootType, "up", enabled);

  const rootElement = rootType != null ? index.elements.get(rootType) : undefined;
  const selectedStepId = selection?.kind === "step" ? selection.step.id : null;
  const seen = useMemo(
    () => (rootType == null ? new Set<number>() : new Set([rootType])),
    [rootType],
  );

  function focusElement(type: number, pushCrumb: boolean) {
    if (pushCrumb && rootType != null && rootType !== type) {
      setCrumb((prev) => [...prev, rootType]);
    }
    setRootType(type);
    setSelection({ kind: "element", elementType: type });
  }

  function goBack() {
    setCrumb((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const prior = next.pop()!;
      setRootType(prior);
      setSelection({ kind: "element", elementType: prior });
      return next;
    });
  }

  function toggleKind(kind: ReactionKind) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) {
        if (next.size === 1) return prev;
        next.delete(kind);
      } else {
        next.add(kind);
      }
      return next;
    });
  }

  const allKindsOn = enabled.size === ALL_KINDS.length;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2" style={{ minHeight: 0 }}>
      <div className="shrink-0 flex items-center gap-3">
        <div className="flex items-center gap-0.5 min-w-0 flex-1">
          {ALL_KINDS.map((kind) => {
            const on = enabled.has(kind);
            return (
              <button
                key={kind}
                type="button"
                onClick={() => toggleKind(kind)}
                title={on ? `Hide ${KIND_LABEL[kind]}` : `Show ${KIND_LABEL[kind]}`}
                className="text-[11px] inline-flex items-center gap-1.5 px-2 py-1 whitespace-nowrap transition-opacity hover:opacity-100"
                style={{
                  borderRadius: 0,
                  color: on ? KIND_COLOR[kind] : "rgb(100, 116, 139)",
                  opacity: on ? 1 : 0.4,
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 shrink-0"
                  style={{ backgroundColor: on ? KIND_COLOR[kind] : "rgb(71, 85, 105)" }}
                />
                <span>{KIND_LABEL[kind]}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400">
          {!allKindsOn ? (
            <button
              type="button"
              onClick={() => setEnabled(new Set(ALL_KINDS))}
              className="hover:text-[#ffe700]"
            >
              All
            </button>
          ) : null}
          <label className="flex items-center gap-1.5">
            <span>Hops</span>
            <select
              value={maxDepth}
              onChange={(event) => setMaxDepth(Number(event.target.value))}
              className="bg-transparent border-0 text-slate-300 text-[11px] py-0 pl-0 pr-1 cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void refreshIndex()}
            className="hover:text-[#ffe700]"
          >
            {liveReady ? "Refresh" : "Loading…"}
          </button>
        </div>
      </div>

      <div
        className="flex-1 min-h-0 grid overflow-hidden border border-slate-600"
        style={{
          gridTemplateColumns: "220px minmax(0, 1fr) 260px",
          minHeight: 0,
        }}
      >
        <aside className="min-h-0 flex flex-col overflow-hidden border-r border-slate-600 bg-black/85">
          <div className="px-2 py-2 border-b border-slate-600 shrink-0">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search elements…"
              className="w-full text-[12px] px-2 py-1.5 bg-slate-900/80 border border-slate-600/50 text-white placeholder:text-slate-500"
              style={{ borderRadius: 0 }}
            />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-1">
            {elementList.map((el) => (
              <PickerRow
                key={el.elementType}
                element={el}
                count={elementStepCount(index, el.elementType)}
                selected={rootType === el.elementType}
                onSelect={() => {
                  setCrumb([]);
                  focusElement(el.elementType, false);
                }}
              />
            ))}
            {elementList.length === 0 ? (
              <p className="text-[11px] text-slate-500 px-2 py-3">No matches.</p>
            ) : null}
          </div>
        </aside>

        <div className="min-w-0 min-h-0 flex flex-col overflow-hidden bg-black/60">
          <RootHeader
            element={rootElement}
            crumb={crumb}
            doesBlurb={doesBlurb}
            fromBlurb={fromBlurb}
            onBack={goBack}
          />
          {rootType != null ? (
            <div
              className="flex-1 min-h-0 grid"
              style={{ gridTemplateRows: "1fr 1fr", minHeight: 0 }}
            >
              <section className="min-h-0 flex flex-col overflow-hidden border-b border-slate-600">
                <div className="px-3 py-1.5 border-b border-slate-700/60 shrink-0 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Does</p>
                  <span className="text-[10px] text-slate-500">{doesCount}</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <FlowList
                    index={index}
                    rootType={rootType}
                    dir="down"
                    maxDepth={maxDepth}
                    seen={seen}
                    enabledKinds={enabled}
                    selectedStepId={selectedStepId}
                    onSelect={(step, elementType) =>
                      setSelection({
                        kind: "step",
                        step,
                        elementType,
                        path: step.id,
                      })
                    }
                    onFocus={(type) => focusElement(type, true)}
                  />
                </div>
              </section>
              <section className="min-h-0 flex flex-col overflow-hidden">
                <div className="px-3 py-1.5 border-b border-slate-700/60 shrink-0 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Comes from</p>
                  <span className="text-[10px] text-slate-500">{fromCount}</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <FlowList
                    index={index}
                    rootType={rootType}
                    dir="up"
                    maxDepth={maxDepth}
                    seen={seen}
                    enabledKinds={enabled}
                    selectedStepId={selectedStepId}
                    onSelect={(step, elementType) =>
                      setSelection({
                        kind: "step",
                        step,
                        elementType,
                        path: step.id,
                      })
                    }
                    onFocus={(type) => focusElement(type, true)}
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[12px] text-slate-500">Select an element on the left.</p>
            </div>
          )}
        </div>

        <aside className="min-h-0 flex flex-col overflow-hidden border-l border-slate-600 bg-black/85">
          <div className="px-3 py-2 border-b border-slate-600 shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Selection</p>
          </div>
          <SelectionPanel index={index} selection={selection} />
        </aside>
      </div>
    </div>
  );
}
