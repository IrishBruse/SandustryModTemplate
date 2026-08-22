import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

export type OptionsSelectOption<T extends string = string> = {
  value: T;
  label: string;
};

type OptionsSelectProps<T extends string = string> = {
  value: T;
  options: OptionsSelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

function SelectChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3 h-3 shrink-0 transition-transform duration-150 ${open ? "rotate-180 text-[#ffe700]" : "text-slate-400"}`}
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Listbox dropdown for language and choice settings. */
export function OptionsSelect<T extends string = string>({
  value,
  options,
  onChange,
  disabled = false,
  className = "",
  style,
}: OptionsSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef(-1);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    highlightRef.current = highlight;
  }, [highlight]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setOpen(false);
      } else if (e.code === "ArrowDown" || e.code === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.code === "ArrowDown" ? 1 : -1;
        setHighlight((idx) => {
          const len = options.length;
          if (len === 0) return -1;
          return (idx + delta + len) % len;
        });
      } else if (e.code === "Enter" || e.code === "NumpadEnter") {
        e.preventDefault();
        e.stopPropagation();
        const opt = options[highlightRef.current];
        if (opt) onChange(opt.value);
        setOpen(false);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [open, options, onChange]);

  useEffect(() => {
    if (!open || highlight < 0) return;
    const el = listRef.current?.children[highlight] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, highlight]);

  const triggerClass = [
    "w-full flex items-center justify-between gap-2 px-3 py-1.5 text-sm",
    "bg-black/40 border rounded-tr-lg rounded-bl-lg transition-colors",
    "text-slate-200",
    open ? "border-[#ffe700]" : "border-slate-700 hover:border-slate-500",
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
  ].join(" ");

  const listClass = [
    "absolute right-0 z-50 min-w-full w-max max-w-xs max-h-60 overflow-y-auto",
    "bg-black/95 border border-slate-700 rounded-tr-lg rounded-bl-lg shadow-lg",
    openUp ? "bottom-full mb-1" : "top-full mt-1",
  ].join(" ");

  return (
    <div ref={rootRef} className={`relative ${className}`} style={style}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          if (!open) {
            const rect = rootRef.current?.getBoundingClientRect();
            setOpenUp(Boolean(rect && window.innerHeight - rect.bottom < 248));
            setHighlight(options.findIndex((opt) => opt.value === value));
          }
          setOpen(!open);
        }}
        className={triggerClass}
      >
        <span className="whitespace-nowrap">{selected?.label ?? ""}</span>
        <SelectChevron open={open} />
      </button>
      {open ? (
        <div ref={listRef} role="listbox" className={listClass}>
          {options.map((opt, index) => {
            const optionClass = [
              "px-3 py-1.5 text-sm whitespace-nowrap cursor-pointer transition-colors",
              opt.value === value ? "text-[#ffe700]" : "text-slate-200",
              index === highlight ? "bg-white/10" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onMouseEnter={() => setHighlight(index)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={optionClass}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
