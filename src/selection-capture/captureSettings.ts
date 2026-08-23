const STORAGE_KEY = "irishbruse.selection-capture.settings";

const MIN_BLOCK_PADDING = 0;
const MAX_BLOCK_PADDING = 32;
const DEFAULT_BLOCK_PADDING = 1;

function clampBlockPadding(value: number): number {
  return Math.min(MAX_BLOCK_PADDING, Math.max(MIN_BLOCK_PADDING, Math.round(value)));
}

const MIN_FRAMES = 2;
const MAX_FRAMES = 120;
const MIN_TICKS = 1;
const MAX_TICKS = 30;

export type CaptureSettings = {
  frames: number;
  ticksPerFrame: number;
  blockPadding: number;
  greenscreen: boolean;
  showMouse: boolean;
  limit1Mb: boolean;
};

export const DEFAULT_CAPTURE_SETTINGS: CaptureSettings = {
  frames: 60,
  ticksPerFrame: MIN_TICKS,
  blockPadding: DEFAULT_BLOCK_PADDING,
  greenscreen: false,
  showMouse: false,
  limit1Mb: false,
};

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function clampBool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeCaptureSettings(
  raw: Partial<CaptureSettings> | null | undefined,
): CaptureSettings {
  const base = DEFAULT_CAPTURE_SETTINGS;
  if (!raw || typeof raw !== "object") return { ...base };
  return {
    frames: clampInt(raw.frames, MIN_FRAMES, MAX_FRAMES, base.frames),
    ticksPerFrame: clampInt(raw.ticksPerFrame, MIN_TICKS, MAX_TICKS, base.ticksPerFrame),
    blockPadding: clampBlockPadding(Number(raw.blockPadding ?? base.blockPadding)),
    greenscreen: clampBool(raw.greenscreen, base.greenscreen),
    showMouse: clampBool(raw.showMouse, base.showMouse),
    limit1Mb: clampBool(raw.limit1Mb, base.limit1Mb),
  };
}

export function loadCaptureSettings(): CaptureSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CAPTURE_SETTINGS };
    return normalizeCaptureSettings(JSON.parse(raw) as Partial<CaptureSettings>);
  } catch (error) {
    console.warn("capture settings load failed:", error);
    return { ...DEFAULT_CAPTURE_SETTINGS };
  }
}

export function saveCaptureSettings(settings: CaptureSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCaptureSettings(settings)));
  } catch (error) {
    console.warn("capture settings save failed:", error);
  }
}

export { MAX_FRAMES, MAX_TICKS, MIN_FRAMES, MIN_TICKS, MIN_BLOCK_PADDING, MAX_BLOCK_PADDING };
