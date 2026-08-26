import { useEffect, useMemo, useRef, useState } from "react";
import { elementSourceLabel } from "../mod-source";
import { contrastText, tileFillCss } from "./element-colors";
import { listElements, type ElementRow } from "./list-elements";
import { buildMatterGroups } from "./matter-layout";

type ElementsTabProps = {
  selectedType: number | null;
};

const TILE_COLUMNS = 8;
const TILE_GAP = 6;

function ElementTile({
  element,
  selected,
  showMatterLabel = false,
}: {
  element: ElementRow;
  selected: boolean;
  showMatterLabel?: boolean;
}) {
  const fill = tileFillCss(element.backgroundCss);
  const ink = contrastText(fill);

  return (
    <button
      type="button"
      data-dev-tools-element={element.elementType}
      title={`${element.name} (${element.id})`}
      className={`
        box-border flex flex-col w-full h-full text-center border overflow-hidden
        ${
          selected
            ? "border-[#ffe700] shadow-[0_0_0_1px_#ffe700]"
            : "border-black/40 hover:border-slate-400/70"
        }
      `}
      style={{
        backgroundColor: fill,
        color: ink,
        borderRadius: 0,
        padding: "6px 7px 7px",
      }}
    >
      <div className="flex items-start justify-between gap-1 shrink-0">
        <span className="text-[12px] font-mono font-semibold tabular-nums leading-none">
          {element.elementType}
        </span>
        {showMatterLabel ? (
          <span className="text-[9px] uppercase tracking-wide opacity-70 truncate max-w-[50%] leading-none pt-0.5">
            {element.matterLabel}
          </span>
        ) : null}
      </div>
      <span className="flex flex-col items-center justify-center flex-1 min-h-0 gap-1 py-1">
        <span
          className="text-[12px] font-semibold w-full"
          style={{
            lineHeight: 1.15,
            overflowWrap: "anywhere",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {element.name}
        </span>
        <span
          className="text-[10px] font-mono opacity-80 w-full"
          style={{ lineHeight: 1.2, overflowWrap: "anywhere", wordBreak: "break-all" }}
        >
          {element.id}
        </span>
      </span>
      <span className="text-[11px] font-mono tabular-nums leading-none opacity-85 shrink-0">
        d{element.density}
        {element.collectorValue > 0 ? ` · ¤${element.collectorValue}` : ""}
      </span>
    </button>
  );
}

function ElementGrid({
  elements,
  selectedType,
  showMatterLabel = false,
}: {
  elements: ElementRow[];
  selectedType: number | null;
  showMatterLabel?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${TILE_COLUMNS}, minmax(0, 1fr))`,
        gap: TILE_GAP,
      }}
    >
      {elements.map((element) => (
        <div key={element.elementType} style={{ aspectRatio: "1 / 1", minWidth: 0 }}>
          <ElementTile
            element={element}
            selected={selectedType === element.elementType}
            showMatterLabel={showMatterLabel}
          />
        </div>
      ))}
    </div>
  );
}

function copyText(text: string): boolean {
  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  } catch {
    return false;
  }
}

function Copyable({ value, className }: { value: string; className?: string }) {
  return (
    <span
      data-copy-text={value}
      title="Click to copy"
      className={`font-mono text-slate-200 cursor-text ${className ?? ""}`}
      style={{ userSelect: "text", WebkitUserSelect: "text" }}
    >
      {value}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5 min-w-0">
      <span className="text-slate-400 shrink-0">{label}</span>
      <Copyable value={value} className="truncate" />
    </div>
  );
}

function boolLabel(value: boolean | null): string | null {
  if (value === null) return null;
  return value ? "yes" : "no";
}

function ElementDetailBar({ element }: { element: ElementRow | null }) {
  if (!element) {
    return (
      <div className="shrink-0 border-t border-slate-700/50 pt-3 mt-2">
        <p className="text-[12px] text-slate-500 text-center py-1">Select an element for stats.</p>
      </div>
    );
  }

  const fill = tileFillCss(element.backgroundCss);
  const ink = contrastText(fill);
  const flags = [
    ["Grab", boolLabel(element.isGrabbable)],
    ["Belt", boolLabel(element.isTransportable)],
    ["Hidden", boolLabel(element.hidden)],
  ].filter((entry): entry is [string, string] => entry[1] !== null);

  return (
    <div
      data-element-details=""
      className="shrink-0 border-t border-slate-700/50 pt-2 mt-2 flex gap-3 items-start max-h-[220px]"
      style={{ userSelect: "text", WebkitUserSelect: "text" }}
    >
      <div
        className="shrink-0 box-border border border-black/50 flex flex-col justify-between"
        style={{
          backgroundColor: fill,
          color: ink,
          width: 72,
          height: 72,
          padding: 6,
          borderRadius: 0,
        }}
      >
        <span
          data-copy-text={String(element.elementType)}
          className="text-[11px] font-mono font-bold leading-none tabular-nums cursor-text"
          title="Click to copy"
        >
          {element.elementType}
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold leading-tight truncate">
            <Copyable value={element.name} />
          </p>
          <p className="text-[9px] leading-tight opacity-80 truncate">
            <Copyable value={element.id} className="opacity-80" />
          </p>
        </div>
      </div>
      <div className="flex-1 min-w-0 text-[11px] leading-snug overflow-y-auto">
        <p className="text-slate-400 mb-1">
          {elementSourceLabel(element.source)} · {element.matterLabel}
          {element.matterType > 0 ? ` (${element.matterType})` : ""}
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          <Stat label="Type #" value={String(element.elementType)} />
          <Stat label="Type" value={element.typeName} />
          <Stat label="Id" value={element.id} />
          <Stat label="Name" value={element.name} />
          <Stat label="Density" value={String(element.density)} />
          {element.materialId !== null ? (
            <Stat label="Material" value={String(element.materialId)} />
          ) : null}
          {element.metaColorHex ? <Stat label="Color" value={element.metaColorHex} /> : null}
          {element.variantCount > 0 ? (
            <Stat label="Variants" value={String(element.variantCount)} />
          ) : null}
          {element.collectorValue > 0 ? (
            <Stat label="Collector" value={String(element.collectorValue)} />
          ) : null}
          {element.duration !== null ? (
            <Stat label="Duration" value={String(element.duration)} />
          ) : null}
          {element.durationRandom ? (
            <Stat label="Duration rng" value={element.durationRandom} />
          ) : null}
          {element.horizontalSpeed !== null ? (
            <Stat label="H speed" value={String(element.horizontalSpeed)} />
          ) : null}
          {flags.map(([label, value]) => (
            <Stat key={label} label={label} value={value} />
          ))}
          {element.flammable ? <Stat label="Flammable" value={element.flammable} /> : null}
          {element.mixes.length > 0 ? (
            <Stat label="Mixes" value={element.mixes.join(", ")} />
          ) : null}
          {element.defaultDataFields.length > 0 ? (
            <Stat label="Data fields" value={element.defaultDataFields.join(", ")} />
          ) : null}
          {element.extraProps.length > 0 ? (
            <Stat label="Extra" value={element.extraProps.join(", ")} />
          ) : null}
          {element.interactions.length > 0 ? (
            <Stat label="Interactions" value={element.interactions.join(", ")} />
          ) : null}
          {element.nameKey ? <Stat label="Name key" value={element.nameKey} /> : null}
          {element.descriptionKey ? <Stat label="Desc key" value={element.descriptionKey} /> : null}
          {element.modId ? <Stat label="Mod" value={element.modId} /> : null}
        </div>
        {element.description ? (
          <p
            className="text-slate-300 mt-1"
            style={{ userSelect: "text", WebkitUserSelect: "text" }}
          >
            <Copyable value={element.description} className="text-slate-300 whitespace-pre-wrap" />
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function ElementsTab({ selectedType }: ElementsTabProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const elements = useMemo(() => listElements(), []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const selected = window.getSelection()?.toString() ?? "";
      if (selected.length > 0) return;
      const target = event.target as Element | null;
      if (!target) return;
      const hit = target.closest("[data-copy-text]") as HTMLElement | null;
      if (!hit) return;
      const text = hit.getAttribute("data-copy-text");
      if (!text) return;
      event.preventDefault();
      event.stopPropagation();
      copyText(text);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const input = searchRef.current;
    if (!input) return;
    function onInput() {
      setQuery(input!.value);
    }
    input.addEventListener("input", onInput);
    return () => input.removeEventListener("input", onInput);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return elements;
    return elements.filter(
      (el) =>
        el.name.toLowerCase().includes(q) ||
        el.id.toLowerCase().includes(q) ||
        el.typeName.toLowerCase().includes(q) ||
        el.matterLabel.toLowerCase().includes(q) ||
        String(el.elementType).includes(q) ||
        (el.nameKey?.toLowerCase().includes(q) ?? false),
    );
  }, [elements, query]);

  const matterGroups = useMemo(() => buildMatterGroups(filtered), [filtered]);
  const selected =
    selectedType !== null ? (elements.find((el) => el.elementType === selectedType) ?? null) : null;

  const searching = query.trim().length > 0;

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <input
          ref={searchRef}
          type="search"
          defaultValue=""
          placeholder="Search elements…"
          data-dev-tools-element-search=""
          className="flex-1 text-[12px] px-2 py-1.5 bg-slate-900/80 border border-slate-600/50 text-white placeholder:text-slate-500"
          style={{ borderRadius: 0 }}
        />
        <span className="text-[10px] text-slate-500 shrink-0">{filtered.length} total</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
        {searching ? (
          <>
            <ElementGrid elements={filtered} selectedType={selectedType} showMatterLabel />
            {filtered.length === 0 ? (
              <p className="text-[12px] text-slate-400 text-center py-6">No matches.</p>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {matterGroups.map((group) => (
              <section key={group.matterType}>
                <h3 className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 px-0.5">
                  {group.label}
                  <span className="text-slate-600 font-normal ml-1.5">
                    ({group.elements.length})
                  </span>
                </h3>
                <ElementGrid elements={group.elements} selectedType={selectedType} />
              </section>
            ))}
            {matterGroups.length === 0 ? (
              <p className="text-[12px] text-slate-400 text-center py-6">No elements registered.</p>
            ) : null}
          </div>
        )}
      </div>

      <ElementDetailBar element={selected} />
    </div>
  );
}

/** Resolve element type from a native click target inside the Dev Tools root. */
export function elementTypeFromClickTarget(target: Element): number | null {
  const el = target.closest("[data-dev-tools-element]") as HTMLElement | null;
  if (!el) return null;
  const raw = el.getAttribute("data-dev-tools-element");
  if (!raw) return null;
  const type = Number(raw);
  return Number.isFinite(type) ? type : null;
}
