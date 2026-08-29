import { useEffect, useRef, useState } from "react";
import {
  HotkeyBadge,
  Interactive,
  OptionsButton,
  OptionsNumberInput,
  OptionsRow,
  OptionsSection,
  OptionsSelect,
  OptionsSliderRow,
  OptionsSwitch,
  OverlayRoot,
} from "@modkit/ui";
import { captureSelectionPng } from "../capture/capturePng";
import { hideAdvancedOverlayDomPreview } from "../capture/advancedOverlayDomPreview";
import {
  installCaptureAreaPreview,
  type CapturePreviewState,
} from "../capture/capturePreview";
import { FloatingWindow } from "./FloatingWindow";
import {
  GIF_SIZE_LIMIT_OPTIONS,
  gifSizeLimitLabel,
  loadCaptureSettings,
  MAX_TICKS,
  MIN_FRAMES,
  MIN_TICKS,
  MAX_OVERLAY_FONT_SIZE,
  MIN_OVERLAY_FONT_SIZE,
  saveCaptureSettings,
  type CaptureSettings,
  type GifSizeLimit,
} from "../capture/captureSettings";
import { modCountdownSeconds, modDownloadPng } from "../capture/modCountdown";
import { modGifScale, modPngScale } from "../capture/modScale";
import { waitCountdownSeconds } from "../capture/countdown";
import { modinfo } from "../modinfo";
import { DEFAULT_ADVANCED_OVERLAY_HTML } from "../capture/captureOverlay";
import { recordSelectionGif } from "../capture/recordGif";
import {
  clampBlockPadding,
  getSelectionCellBounds,
  resolveCaptureBounds,
  MAX_BLOCK_PADDING,
  MIN_BLOCK_PADDING,
  type CellBounds,
} from "../capture/selectionBounds";

/** Game `registerBinding` forwards `displayNameKey`, not `displayName`. */
const BINDINGS = {
  togglePanel: `${modinfo.id}.togglePanel`,
  screenshot: `${modinfo.id}.screenshot`,
  recordGif: `${modinfo.id}.recordGif`,
} as const;

type OverlayLive = {
  bindingsInstalled: boolean;
  open: boolean;
  toggle: () => void;
  screenshot: () => void;
  recordGif: () => void;
  abortRecord: AbortController | null;
};

/**
 * Binding handlers stay registered for the process. Keep the latest Overlay
 * methods here so a remount does not stack a second F7 toggle.
 */
const live: OverlayLive = (() => {
  const key = `${modinfo.id}:overlay`;
  const root = globalThis as typeof globalThis & Record<string, OverlayLive | undefined>;
  return (root[key] ??= {
    bindingsInstalled: false,
    open: false,
    toggle: () => {},
    screenshot: () => {},
    recordGif: () => {},
    abortRecord: null,
  });
})();

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

const FIELD_CLASS =
  "w-full min-w-[10rem] px-2 py-1.5 text-sm bg-black/40 text-slate-200 border border-slate-700 rounded-tr-lg rounded-bl-lg focus:border-[#ffe700] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const TEXTAREA_CLASS = `${FIELD_CLASS} min-h-[9rem] font-mono text-xs leading-relaxed resize-y`;

function clampMinInt(value: number, min: number): number {
  return Math.max(min, Math.round(value));
}

function formatEdgeAlign(value: number, minLabel: string, maxLabel: string): string {
  if (value <= 0) return minLabel;
  if (value >= 100) return maxLabel;
  return `${value}%`;
}

function isToggleKey(event: KeyboardEvent): boolean {
  if (event.key === "F7" || event.code === "F7") return true;
  const bound = sandkit.api.input.getBoundKeys(BINDINGS.togglePanel);
  return bound.some((key) => {
    const k = key.toLowerCase();
    return event.key.toLowerCase() === k || event.code.toLowerCase() === k;
  });
}

function installBindings() {
  if (live.bindingsInstalled) return;
  live.bindingsInstalled = true;

  const api = sandkit.api;
  const category = modinfo.name;

  // F-keys never reach these handlers — toggle uses capture-phase keydown below.
  api.input.registerBinding(BINDINGS.togglePanel, ["F7"], {
    displayName: "Toggle panel",
    displayNameKey: "Toggle panel",
    category,
    handlers: { down: () => {} },
  });
  api.input.registerBinding(BINDINGS.screenshot, [], {
    displayName: "Screenshot",
    displayNameKey: "Screenshot",
    category,
    handlers: { down: () => live.screenshot() },
  });
  api.input.registerBinding(BINDINGS.recordGif, [], {
    displayName: "Record GIF",
    displayNameKey: "Record GIF",
    category,
    handlers: { down: () => void live.recordGif() },
  });
}

export function Overlay() {
  const [open, setOpen] = useState(() => live.open);
  const [settings, setSettings] = useState<CaptureSettings>(loadCaptureSettings);
  const {
    frames,
    ticksPerFrame,
    blockPadding,
    greenscreen,
    showMouse,
    gifSizeLimit,
    lockedGifBounds,
    overlay,
  } = settings;
  const [phase, setPhase] = useState<"idle" | "countdown" | "recording" | "encoding">("idle");
  const [countdownLeft, setCountdownLeft] = useState<number | null>(null);
  const [frozenBounds, setFrozenBounds] = useState<CellBounds | null>(null);
  const busy = phase !== "idle";

  function patchSettings(patch: Partial<CaptureSettings>) {
    setSettings((current) => ({ ...current, ...patch }));
  }

  useEffect(() => {
    saveCaptureSettings(settings);
  }, [settings]);

  live.toggle = () => {
    live.open = !live.open;
    setOpen(live.open);
  };

  live.screenshot = () => {
    if (busy) return;
    const api = sandkit.api;
    const download = modDownloadPng(api);
    void (async () => {
      try {
        const result = await captureSelectionPng(
          api,
          { greenscreen, showMouse },
          {
            blockPadding,
            lockedBounds: lockedGifBounds,
            download,
            scale: modPngScale(api),
            overlay,
          },
        );
        switch (result) {
          case "ok":
            api.ui.toast(download ? "PNG saved" : "Copied — paste with Ctrl+V", {});
            break;
          case "no-selection":
            api.ui.toast("No selection — press C, drag, or Lock capture area", {});
            break;
          case "out-of-view":
            api.ui.toast("Selection is off-screen — pan the camera and try again", {});
            break;
          default:
            api.ui.toast(download ? "PNG save failed" : "Clipboard copy failed", {});
            break;
        }
      } catch (error) {
        console.error("PNG capture threw:", error);
        api.ui.toast(download ? "PNG save failed" : "Clipboard copy failed", {});
      }
    })();
  };

  live.recordGif = () => {
    if (live.abortRecord) {
      live.abortRecord.abort();
      return;
    }
    const abort = new AbortController();
    live.abortRecord = abort;
    const api = sandkit.api;
    const gifBounds = resolveCaptureBounds(api, lockedGifBounds, { blockPadding });
    if (!gifBounds) {
      live.abortRecord = null;
      api.ui.toast("Lock capture area or press C, drag, then Record", {});
      return;
    }
    setFrozenBounds(gifBounds);
    setPhase("countdown");
    void (async () => {
      try {
        const countdown = await waitCountdownSeconds(
          modCountdownSeconds(api),
          abort.signal,
          (remaining) => setCountdownLeft(remaining),
        );
        setCountdownLeft(null);
        if (countdown === "cancelled") {
          api.ui.toast("GIF cancelled", {});
          return;
        }

        setPhase("recording");
        const result = await recordSelectionGif(api, {
          frames,
          ticksPerFrame,
          greenscreen,
          showMouse,
          gifSizeLimit,
          blockPadding,
          bounds: gifBounds,
          scale: modGifScale(api),
          signal: abort.signal,
          overlay,
          onEncodeStart: () => setPhase("encoding"),
        });
        const sizeLabel = gifSizeLimitLabel(gifSizeLimit);
        switch (result) {
          case "ok":
            api.ui.toast("GIF saved", {});
            break;
          case "ok-capped":
            api.ui.toast(`GIF saved — ${sizeLabel} limit`, {});
            break;
          case "too-large":
            api.ui.toast(`Selection too large for ${sizeLabel} — crop smaller`, {});
            break;
          case "cancelled":
            api.ui.toast("GIF cancelled", {});
            break;
          case "no-selection":
            api.ui.toast("Lock capture area or press C, drag, then Record", {});
            break;
          case "out-of-view":
            api.ui.toast("Selection is off-screen — pan the camera and try again", {});
            break;
          default:
            api.ui.toast("GIF record failed", {});
            break;
        }
      } catch (error) {
        console.error("record threw:", error);
        api.ui.toast("GIF record failed", {});
      } finally {
        if (live.abortRecord === abort) live.abortRecord = null;
        setCountdownLeft(null);
        setFrozenBounds(null);
        setPhase("idle");
      }
    })();
  };

  useEffect(() => {
    installBindings();

    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
      if (!isToggleKey(event)) return;
      event.preventDefault();
      event.stopPropagation();
      live.toggle();
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  const outline =
    phase === "encoding" ? "encoding" : phase === "recording" ? "recording" : "idle";
  const previewStateRef = useRef<CapturePreviewState>({
    blockPadding,
    outline,
    frozenBounds,
    lockedGifBounds,
    overlay,
  });
  previewStateRef.current = {
    blockPadding,
    outline,
    frozenBounds,
    lockedGifBounds,
    overlay,
  };

  useEffect(() => {
    if (!open) {
      hideAdvancedOverlayDomPreview();
      return;
    }
    // Keep one subscription for the open panel so phase changes do not tear down
    // the live advanced overlay mid-record (SVG bake needs that DOM).
    return installCaptureAreaPreview(() => previewStateRef.current);
  }, [open]);

  function lockGifArea() {
    if (busy) return;
    const api = sandkit.api;
    const bounds = getSelectionCellBounds(api, { blockPadding });
    if (!bounds) {
      api.ui.toast("No marquee selection — press C, drag, then Lock capture area", {});
      return;
    }
    patchSettings({ lockedGifBounds: bounds });
    api.ui.toast("Capture area locked", {});
  }

  function clearLockedGifArea() {
    if (busy) return;
    patchSettings({ lockedGifBounds: null });
    sandkit.api.ui.toast("Capture area cleared", {});
  }

  if (!open) return null;

  const api = sandkit.api;
  const downloadPng = modDownloadPng(api);
  const screenshotKey = api.input.getDisplayKey(BINDINGS.screenshot);
  const recordGifKey = api.input.getDisplayKey(BINDINGS.recordGif);

  return (
    <OverlayRoot>
      <Interactive>
        <FloatingWindow
          title={modinfo.name}
          storageKey={`${modinfo.id}:panel-geometry`}
          onClose={() => live.toggle()}
        >
          <>
            {/* Do not add OptionsRow description subtext unless asked — it widens the panel. */}
            <OptionsRow label="Frames">
              <OptionsNumberInput
                value={frames}
                min={MIN_FRAMES}
                disabled={busy}
                aria-label="Frames"
                onChange={(value) =>
                  patchSettings({
                    frames: clampMinInt(value, MIN_FRAMES),
                  })
                }
              />
            </OptionsRow>
            <OptionsRow label="Ticks / frame">
              <OptionsNumberInput
                value={ticksPerFrame}
                min={MIN_TICKS}
                max={MAX_TICKS}
                disabled={busy}
                aria-label="Ticks per frame"
                onChange={(value) =>
                  patchSettings({
                    ticksPerFrame: clampInt(value, MIN_TICKS, MAX_TICKS),
                  })
                }
              />
            </OptionsRow>
            <OptionsRow label="Block padding">
              <OptionsNumberInput
                value={blockPadding}
                min={MIN_BLOCK_PADDING}
                max={MAX_BLOCK_PADDING}
                disabled={busy}
                aria-label="Block padding"
                onChange={(value) => patchSettings({ blockPadding: clampBlockPadding(value) })}
              />
            </OptionsRow>
            <OptionsRow label="Greenscreen">
              <OptionsSwitch
                checked={greenscreen}
                disabled={busy}
                onChange={(checked) => patchSettings({ greenscreen: checked })}
              />
            </OptionsRow>
            <OptionsRow label="Show mouse">
              <OptionsSwitch
                checked={showMouse}
                disabled={busy}
                onChange={(checked) => patchSettings({ showMouse: checked })}
              />
            </OptionsRow>
            <OptionsRow label="GIF size limit" description="Can take some time to encode.">
              <OptionsSelect
                value={gifSizeLimit}
                options={GIF_SIZE_LIMIT_OPTIONS}
                disabled={busy}
                className="min-w-28"
                onChange={(value: GifSizeLimit) => patchSettings({ gifSizeLimit: value })}
              />
            </OptionsRow>
          </>
          <OptionsSection title="Overlay">
            <OptionsRow label="Enable">
              <OptionsSwitch
                checked={overlay.enabled}
                disabled={busy}
                onChange={(checked) =>
                  patchSettings({ overlay: { ...overlay, enabled: checked } })
                }
              />
            </OptionsRow>
            {overlay.enabled ? (
              <>
                <OptionsRow label="Advanced">
                  <OptionsSwitch
                    checked={overlay.advanced}
                    disabled={busy}
                    onChange={(checked) => {
                      const next = { ...overlay, advanced: checked };
                      if (checked && !next.html.trim()) {
                        next.html = DEFAULT_ADVANCED_OVERLAY_HTML;
                      }
                      patchSettings({ overlay: next });
                    }}
                  />
                </OptionsRow>
                {overlay.advanced ? (
                  <div className="py-2">
                    <span className="text-sm font-medium text-slate-200">HTML / CSS</span>
                    <textarea
                      value={overlay.html}
                      disabled={busy}
                      aria-label="Overlay HTML and CSS"
                      spellCheck={false}
                      className={`${TEXTAREA_CLASS} mt-2`}
                      onChange={(event) =>
                        patchSettings({ overlay: { ...overlay, html: event.target.value } })
                      }
                    />
                  </div>
                ) : (
                  <>
                    <OptionsRow label="Text">
                      <input
                        type="text"
                        value={overlay.text}
                        disabled={busy}
                        aria-label="Overlay text"
                        placeholder="Factory tour"
                        className={FIELD_CLASS}
                        onChange={(event) =>
                          patchSettings({ overlay: { ...overlay, text: event.target.value } })
                        }
                      />
                    </OptionsRow>
                    <OptionsRow label="Font size">
                      <OptionsNumberInput
                        value={overlay.fontSize}
                        min={MIN_OVERLAY_FONT_SIZE}
                        max={MAX_OVERLAY_FONT_SIZE}
                        disabled={busy}
                        aria-label="Overlay font size"
                        onChange={(value) =>
                          patchSettings({
                            overlay: {
                              ...overlay,
                              fontSize: clampInt(
                                value,
                                MIN_OVERLAY_FONT_SIZE,
                                MAX_OVERLAY_FONT_SIZE,
                              ),
                            },
                          })
                        }
                      />
                    </OptionsRow>
                    <OptionsSliderRow
                      label="Vertical"
                      value={overlay.verticalAlign}
                      min={0}
                      max={100}
                      formatValue={(value) => formatEdgeAlign(value, "Top", "Bottom")}
                      onChange={(value) =>
                        patchSettings({
                          overlay: { ...overlay, verticalAlign: clampInt(value, 0, 100) },
                        })
                      }
                    />
                    <OptionsSliderRow
                      label="Horizontal"
                      value={overlay.horizontalAlign}
                      min={0}
                      max={100}
                      formatValue={(value) => formatEdgeAlign(value, "Left", "Right")}
                      onChange={(value) =>
                        patchSettings({
                          overlay: { ...overlay, horizontalAlign: clampInt(value, 0, 100) },
                        })
                      }
                    />
                    <p className="text-xs text-slate-400 pb-2">
                      0% touches the top or left border. 100% touches the bottom or right border.
                    </p>
                  </>
                )}
              </>
            ) : null}
          </OptionsSection>
          <OptionsSection title="Actions">
            <OptionsRow label="Capture area">
              <div className="flex items-center gap-2">
                <OptionsButton disabled={busy} onClick={() => lockGifArea()}>
                  Lock
                </OptionsButton>
                <OptionsButton
                  disabled={busy || !lockedGifBounds}
                  onClick={() => clearLockedGifArea()}
                >
                  Clear
                </OptionsButton>
              </div>
            </OptionsRow>
            <OptionsRow
              label={
                phase === "encoding"
                  ? "Encoding…"
                  : phase === "recording"
                    ? "Recording…"
                    : phase === "countdown"
                      ? "Starting…"
                      : "Record GIF"
              }
            >
              <div className="flex items-center gap-2">
                {!busy && recordGifKey ? <HotkeyBadge>{recordGifKey}</HotkeyBadge> : null}
                <OptionsButton onClick={() => live.recordGif()}>
                  {phase === "countdown" && countdownLeft !== null
                    ? String(countdownLeft)
                    : busy
                      ? "Cancel"
                      : "Record"}
                </OptionsButton>
              </div>
            </OptionsRow>
            <OptionsRow label="Screenshot">
              <div className="flex items-center gap-2">
                {screenshotKey ? <HotkeyBadge>{screenshotKey}</HotkeyBadge> : null}
                <OptionsButton disabled={busy} onClick={() => live.screenshot()}>
                  {downloadPng ? "Download PNG" : "Copy PNG"}
                </OptionsButton>
              </div>
            </OptionsRow>
          </OptionsSection>
        </FloatingWindow>
      </Interactive>
    </OverlayRoot>
  );
}
