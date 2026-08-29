import type { ElementRow } from "../elements/list-elements";
import { ElementPixel } from "../elements/ElementPixel";
import type { ChainStep } from "./chain-index";
import { rowIsOpen, type TreeDirection, type TreeRow } from "./chain-tree";
import { KIND_COLOR, KIND_LABEL } from "./step-icons";

const GUTTER = 16;
const AUTO_EXPAND = 2;

function chanceLabel(chance: number | undefined): string | null {
  if (chance == null || !(chance < 1)) return null;
  return `${Math.round(chance * 100)}%`;
}

function StepGlyph({ step, size = 14 }: { step: ChainStep; size?: number }) {
  if (step.iconSrc) {
    return (
      <img
        src={step.iconSrc}
        alt=""
        width={size}
        height={size}
        className="shrink-0"
        style={{ imageRendering: "pixelated" }}
      />
    );
  }
  return (
    <span
      className="inline-block shrink-0 border border-black/40"
      style={{
        width: size,
        height: size,
        backgroundColor: KIND_COLOR[step.kind],
        borderRadius: 0,
      }}
      title={KIND_LABEL[step.kind]}
    />
  );
}

/** Classic outline rails: │ spaces, then ├─ or └─. */
function TreeRails({ row }: { row: TreeRow }) {
  return (
    <span className="inline-flex shrink-0 self-stretch" aria-hidden>
      {row.ancestorLast.map((wasLast, index) => (
        <span
          key={index}
          className="relative shrink-0"
          style={{ width: GUTTER }}
        >
          {!wasLast ? (
            <span
              className="absolute left-1/2 top-0 bottom-0"
              style={{
                width: 1,
                marginLeft: -0.5,
                backgroundColor: "rgb(71, 85, 105)",
              }}
            />
          ) : null}
        </span>
      ))}
      <span className="relative shrink-0" style={{ width: GUTTER }}>
        {/* vertical stub from parent mid to this row mid (or to bottom if not last) */}
        <span
          className="absolute left-1/2"
          style={{
            width: 1,
            marginLeft: -0.5,
            top: 0,
            height: row.isLast ? "50%" : "100%",
            backgroundColor: "rgb(71, 85, 105)",
          }}
        />
        {/* horizontal elbow to the label */}
        <span
          className="absolute top-1/2 left-1/2 right-0"
          style={{
            height: 1,
            marginTop: -0.5,
            backgroundColor: "rgb(71, 85, 105)",
          }}
        />
      </span>
    </span>
  );
}

export function ChainTree({
  rows,
  elements,
  direction,
  expanded,
  selectedPath,
  onToggle,
  onSelect,
  onFocus,
}: {
  rows: TreeRow[];
  elements: Map<number, ElementRow>;
  direction: TreeDirection;
  expanded: ReadonlySet<string>;
  selectedPath: string | null;
  onToggle: (path: string, currentlyOpen: boolean) => void;
  onSelect: (row: TreeRow) => void;
  onFocus: (elementType: number) => void;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-[11px] text-slate-500 px-2 py-3">
        {direction === "up" ? "No producers." : "No consumers."}
      </p>
    );
  }

  return (
    <div className="flex flex-col py-1 font-sans">
      {rows.map((row) => {
        const element =
          row.elementType != null ? elements.get(row.elementType) : undefined;
        const open = rowIsOpen(row.path, row.expandDepth, expanded, AUTO_EXPAND);
        const selected = selectedPath === row.path;
        const pct = chanceLabel(row.chance);
        const isStep = row.kind === "step";

        return (
          <div
            key={row.path}
            className={`flex items-stretch min-h-[30px] pr-1 ${
              selected ? "bg-[#ffe700]/10" : "hover:bg-white/5"
            }`}
          >
            <TreeRails row={row} />

            <div
              className={`flex-1 min-w-0 flex items-center gap-1.5 my-0.5 px-1.5 border ${
                selected
                  ? "border-[#ffe700] text-[#ffe700]"
                  : isStep
                    ? "border-slate-600/80 text-white"
                    : "border-transparent text-white"
              }`}
              style={{
                borderRadius: 0,
                borderLeftWidth: isStep ? 3 : 1,
                borderLeftColor: isStep ? KIND_COLOR[row.step.kind] : undefined,
                backgroundColor: isStep ? "rgba(0,0,0,0.45)" : "transparent",
              }}
            >
              {row.hasChildren ? (
                <button
                  type="button"
                  className="shrink-0 w-4 h-4 text-[10px] text-slate-400 hover:text-[#ffe700]"
                  aria-label={open ? "Collapse" : "Expand"}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggle(row.path, open);
                  }}
                >
                  {open ? "▾" : "▸"}
                </button>
              ) : (
                <span className="shrink-0 w-4 h-4" />
              )}

              <button
                type="button"
                className="flex-1 min-w-0 flex items-center gap-1.5 text-left py-1"
                onClick={() => onSelect(row)}
              >
                {isStep ? (
                  <>
                    <StepGlyph step={row.step} size={16} />
                    <span className="text-[12px] font-semibold truncate">
                      {row.step.label}
                    </span>
                    <span
                      className="text-[10px] shrink-0"
                      style={{ color: KIND_COLOR[row.step.kind] }}
                    >
                      {KIND_LABEL[row.step.kind]}
                    </span>
                    {pct && direction === "up" ? (
                      <span className="text-[10px] text-slate-400 shrink-0">{pct}</span>
                    ) : null}
                    {row.sink ? (
                      <span className="text-[9px] uppercase tracking-wide text-slate-500 shrink-0">
                        sink
                      </span>
                    ) : null}
                  </>
                ) : (
                  <>
                    <ElementPixel element={element} size={16} />
                    <span className="text-[12px] font-semibold truncate">
                      {element?.name ?? `type ${row.elementType}`}
                    </span>
                    {pct && direction === "down" ? (
                      <span className="text-[10px] text-slate-400 shrink-0">{pct}</span>
                    ) : null}
                    {row.loop ? (
                      <span className="text-[9px] uppercase tracking-wide text-amber-400/90 shrink-0">
                        loop
                      </span>
                    ) : null}
                  </>
                )}
              </button>

              {!isStep && row.elementType != null && !row.loop ? (
                <button
                  type="button"
                  className="shrink-0 text-[9px] uppercase tracking-wide text-slate-500 hover:text-[#ffe700] px-1"
                  title="Focus this element"
                  onClick={(event) => {
                    event.stopPropagation();
                    onFocus(row.elementType!);
                  }}
                >
                  Focus
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
