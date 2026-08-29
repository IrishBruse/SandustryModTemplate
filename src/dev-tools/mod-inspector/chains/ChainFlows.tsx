import { ElementPixel } from "../elements/ElementPixel";
import type { ElementRow } from "../elements/list-elements";
import type { ChainIndex, ChainStep } from "./chain-index";
import { hopNeighbors, stepsFor, type TreeDirection } from "./chain-tree";
import { KIND_COLOR, KIND_LABEL, type ReactionKind } from "./step-icons";

function chanceLabel(chance: number | undefined): string | null {
  if (chance == null || !(chance < 1)) return null;
  return `${Math.round(chance * 100)}%`;
}

function StepGlyph({ step, size = 16 }: { step: ChainStep; size?: number }) {
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

function Arrow() {
  return <span className="text-[11px] text-slate-500 shrink-0 px-0.5">→</span>;
}

function ElementChip({
  element,
  type,
  highlight,
  chance,
  loop,
  onFocus,
}: {
  element: ElementRow | undefined;
  type: number;
  highlight: boolean;
  chance?: number;
  loop?: boolean;
  onFocus: (type: number) => void;
}) {
  const pct = chanceLabel(chance);
  const name = element?.name ?? `type ${type}`;
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onFocus(type);
      }}
      title={`Focus ${name}`}
      className={`inline-flex items-center gap-1 px-1.5 py-1 border shrink-0 max-w-[140px] ${
        highlight
          ? "border-[#ffe700] text-[#ffe700] bg-black"
          : "border-slate-600 text-white hover:border-[#ffe700]"
      }`}
      style={{ borderRadius: 0 }}
    >
      <ElementPixel element={element} size={12} />
      <span className="text-[12px] font-semibold truncate">{name}</span>
      {pct ? <span className="text-[10px] text-slate-400">{pct}</span> : null}
      {loop ? (
        <span className="text-[9px] uppercase tracking-wide text-amber-400/90">loop</span>
      ) : null}
    </button>
  );
}

function FlowCard({
  index,
  step,
  focusType,
  selected,
  onSelect,
  onFocus,
}: {
  index: ChainIndex;
  step: ChainStep;
  focusType: number;
  selected: boolean;
  onSelect: () => void;
  onFocus: (type: number) => void;
}) {
  const sink = step.outputs.length === 0;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`w-full text-left px-2 py-2 border cursor-pointer ${
        selected
          ? "border-[#ffe700] bg-black/60"
          : "border-slate-600 bg-black/35 hover:border-slate-400"
      }`}
      style={{
        borderRadius: 0,
        borderLeftWidth: 3,
        borderLeftColor: KIND_COLOR[step.kind],
      }}
    >
      <div className="flex flex-wrap items-center gap-1">
        {step.inputs.map((type) => (
          <ElementChip
            key={`in-${type}`}
            element={index.elements.get(type)}
            type={type}
            highlight={type === focusType}
            onFocus={onFocus}
          />
        ))}
        {step.inputs.length === 0 ? <span className="text-[11px] text-slate-500">—</span> : null}

        <Arrow />

        <span className="inline-flex items-center gap-1.5 px-1.5 py-1 border border-slate-600 bg-black/50 shrink-0">
          <StepGlyph step={step} />
          <span className="text-[12px] font-semibold text-white">{step.label}</span>
          <span className="text-[10px]" style={{ color: KIND_COLOR[step.kind] }}>
            {KIND_LABEL[step.kind]}
          </span>
        </span>

        {sink ? (
          <>
            <Arrow />
            <span className="text-[11px] text-slate-400">sink</span>
          </>
        ) : (
          <>
            <Arrow />
            {step.outputs.map((out) => (
              <ElementChip
                key={`out-${out.elementType}`}
                element={index.elements.get(out.elementType)}
                type={out.elementType}
                highlight={out.elementType === focusType}
                chance={out.chance}
                onFocus={onFocus}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function NestedFlows({
  index,
  fromType,
  dir,
  remaining,
  seen,
  enabledKinds,
  selectedStepId,
  onSelect,
  onFocus,
}: {
  index: ChainIndex;
  fromType: number;
  dir: TreeDirection;
  remaining: number;
  seen: ReadonlySet<number>;
  enabledKinds: ReadonlySet<ReactionKind>;
  selectedStepId: string | null;
  onSelect: (step: ChainStep, elementType: number) => void;
  onFocus: (type: number) => void;
}) {
  if (remaining <= 0) return null;
  const nextSteps = stepsFor(index, fromType, dir, enabledKinds);
  if (nextSteps.length === 0) return null;
  const nextSeen = new Set(seen);
  nextSeen.add(fromType);
  return (
    <FlowList
      index={index}
      rootType={fromType}
      dir={dir}
      maxDepth={remaining}
      seen={nextSeen}
      enabledKinds={enabledKinds}
      selectedStepId={selectedStepId}
      onSelect={onSelect}
      onFocus={onFocus}
    />
  );
}

export function FlowList({
  index,
  rootType,
  dir,
  maxDepth,
  seen,
  enabledKinds,
  selectedStepId,
  onSelect,
  onFocus,
}: {
  index: ChainIndex;
  rootType: number;
  dir: TreeDirection;
  maxDepth: number;
  seen: ReadonlySet<number>;
  enabledKinds: ReadonlySet<ReactionKind>;
  selectedStepId: string | null;
  onSelect: (step: ChainStep, elementType: number) => void;
  onFocus: (type: number) => void;
}) {
  const steps = stepsFor(index, rootType, dir, enabledKinds);
  if (steps.length === 0) {
    return (
      <p className="text-[11px] text-slate-500 px-2 py-3">
        {dir === "down" ? "Nothing consumes this element." : "Nothing produces this element."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-2 px-2">
      {steps.map((step) => {
        const neighbors = hopNeighbors(step, dir, rootType);
        return (
          <div key={`${rootType}:${step.id}`} className="flex flex-col gap-1">
            <FlowCard
              index={index}
              step={step}
              focusType={rootType}
              selected={selectedStepId === step.id}
              onSelect={() => onSelect(step, rootType)}
              onFocus={onFocus}
            />
            {maxDepth > 1
              ? neighbors.map((type) => {
                  if (seen.has(type)) {
                    return (
                      <p key={type} className="text-[10px] text-amber-400/80 pl-4">
                        loop · {index.elements.get(type)?.name ?? type}
                      </p>
                    );
                  }
                  return (
                    <div key={type} className="pl-4 border-l border-slate-700 ml-2">
                      <NestedFlows
                        index={index}
                        fromType={type}
                        dir={dir}
                        remaining={maxDepth - 1}
                        seen={seen}
                        enabledKinds={enabledKinds}
                        selectedStepId={selectedStepId}
                        onSelect={onSelect}
                        onFocus={onFocus}
                      />
                    </div>
                  );
                })
              : null}
          </div>
        );
      })}
    </div>
  );
}
