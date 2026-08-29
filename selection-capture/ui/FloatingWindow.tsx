import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const DEFAULT_WIDTH = 448; // 28rem — same as Debug
const DEFAULT_HEIGHT = 640;
const MIN_WIDTH = 280;
const MIN_HEIGHT = 220;
const VIEW_MARGIN = 8;

export type FloatingWindowGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type FloatingWindowProps = {
  title: string;
  /** Optional subtitle in the title bar (Debug shows Elem: …). */
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  storageKey?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readStoredGeometry(key: string | undefined): FloatingWindowGeometry | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<FloatingWindowGeometry>;
    if (
      typeof value.x !== "number" ||
      typeof value.y !== "number" ||
      typeof value.width !== "number" ||
      typeof value.height !== "number"
    ) {
      return null;
    }
    return {
      x: value.x,
      y: value.y,
      width: value.width,
      height: value.height,
    };
  } catch {
    return null;
  }
}

function defaultGeometry(width: number, height: number): FloatingWindowGeometry {
  const vw = typeof window !== "undefined" ? window.innerWidth : width + 32;
  const vh = typeof window !== "undefined" ? window.innerHeight : height + 32;
  return {
    x: Math.max(VIEW_MARGIN, vw - width - 16),
    y: 16,
    width,
    height: Math.min(height, Math.max(MIN_HEIGHT, vh - 32)),
  };
}

function clampGeometry(
  geo: FloatingWindowGeometry,
  minWidth: number,
  minHeight: number,
): FloatingWindowGeometry {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = clamp(geo.width, minWidth, Math.max(minWidth, vw - VIEW_MARGIN * 2));
  const height = clamp(geo.height, minHeight, Math.max(minHeight, vh - VIEW_MARGIN * 2));
  const x = clamp(geo.x, VIEW_MARGIN, Math.max(VIEW_MARGIN, vw - width - VIEW_MARGIN));
  const y = clamp(geo.y, VIEW_MARGIN, Math.max(VIEW_MARGIN, vh - height - VIEW_MARGIN));
  return { x, y, width, height };
}

/** Debug-style floating chrome: drag title bar, corner resize, close ✕. */
export function FloatingWindow({
  title,
  subtitle,
  onClose,
  children,
  className = "",
  style,
  storageKey,
  defaultWidth = DEFAULT_WIDTH,
  defaultHeight = DEFAULT_HEIGHT,
  minWidth = MIN_WIDTH,
  minHeight = MIN_HEIGHT,
}: FloatingWindowProps) {
  const [geo, setGeo] = useState<FloatingWindowGeometry>(() => {
    const stored = readStoredGeometry(storageKey);
    return clampGeometry(
      stored ?? defaultGeometry(defaultWidth, defaultHeight),
      minWidth,
      minHeight,
    );
  });

  const dragRef = useRef<{
    mode: "move" | "resize";
    startX: number;
    startY: number;
    origin: FloatingWindowGeometry;
  } | null>(null);

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(geo));
    } catch {
      /* ignore quota */
    }
  }, [geo, storageKey]);

  useEffect(() => {
    function onResize() {
      setGeo((current) => clampGeometry(current, minWidth, minHeight));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [minWidth, minHeight]);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (drag.mode === "move") {
        setGeo(
          clampGeometry(
            {
              ...drag.origin,
              x: drag.origin.x + dx,
              y: drag.origin.y + dy,
            },
            minWidth,
            minHeight,
          ),
        );
        return;
      }
      setGeo(
        clampGeometry(
          {
            ...drag.origin,
            width: drag.origin.width + dx,
            height: drag.origin.height + dy,
          },
          minWidth,
          minHeight,
        ),
      );
    },
    [minWidth, minHeight],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", endDrag);
  }, [onPointerMove]);

  function beginDrag(mode: "move" | "resize", event: ReactPointerEvent) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: geo,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
  }

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: geo.x,
        top: geo.y,
        transformOrigin: "left top",
      }}
    >
      <div
        className={`relative text-white bg-black bg-opacity-85 border border-gray-700 shadow-lg rounded-lg ui-box card-2 pointer-events-auto flex flex-col ${className}`}
        style={{
          width: geo.width,
          height: geo.height,
          maxWidth: "90vw",
          ...style,
        }}
        role="dialog"
        aria-label={title}
      >
        <div
          className="relative h-8 cursor-move select-none flex items-center justify-between px-3 border-b border-gray-700 shrink-0"
          onPointerDown={(event) => beginDrag("move", event)}
        >
          <span className="text-xs uppercase tracking-wider text-gray-300">{title}</span>
          {subtitle ? <span className="text-[10px] text-gray-400">{subtitle}</span> : <span />}
          <button
            type="button"
            className="text-white hover:text-[#ffe700] transition-colors leading-none px-1"
            aria-label="Close"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 min-h-0 p-3 overflow-y-auto">{children}</div>

        <div
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize opacity-50 hover:opacity-100 transition-opacity flex items-end justify-end pr-0.5 pb-0.5"
          onPointerDown={(event) => beginDrag("resize", event)}
          aria-label="Resize"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-gray-400"
            aria-hidden="true"
          >
            <path
              d="M12 0L0 12M8 12L12 8M12 4L8 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
