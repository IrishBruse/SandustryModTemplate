import { useEffect, useState } from "react";
import {
  FixedAnchor,
  HotkeyBadge,
  Interactive,
  OptionsButton,
  OptionsNumberInput,
  OptionsPanel,
  OptionsRow,
  OptionsSection,
  OptionsSwitch,
  OverlayRoot,
} from "@modkit/ui";
import { captureSelectionPng } from "../capture/capturePng";
import { installCaptureAreaPreview } from "../capture/capturePreview";
import {
  loadCaptureSettings,
  MAX_FRAMES,
  MAX_TICKS,
  MIN_FRAMES,
  MIN_TICKS,
  saveCaptureSettings,
  type CaptureSettings,
} from "../capture/captureSettings";
import { modinfo } from "../mod";
import { recordSelectionGif } from "../capture/recordGif";
import {
  clampBlockPadding,
  getSelectionCellBounds,
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
  const { frames, ticksPerFrame, blockPadding, greenscreen, showMouse, limit1Mb } = settings;
  const [phase, setPhase] = useState<"idle" | "recording" | "encoding">("idle");
  const [frozenBounds, setFrozenBounds] = useState<CellBounds | null>(null);
  const busy = phase !== "idle";
  const recording = phase === "recording" || phase === "encoding";

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
    void (async () => {
      try {
        const result = await captureSelectionPng(api, { greenscreen, showMouse }, { blockPadding });
        switch (result) {
          case "ok":
            api.ui.toast("Copied — paste with Ctrl+V", {});
            break;
          case "no-selection":
            api.ui.toast("No marquee selection — press C, drag, then Screenshot", {});
            break;
          case "out-of-view":
            api.ui.toast("Selection is off-screen — pan the camera and try again", {});
            break;
          default:
            api.ui.toast("Clipboard copy failed", {});
            break;
        }
      } catch (error) {
        console.error("PNG capture threw:", error);
        api.ui.toast("Clipboard copy failed", {});
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
    const snapshot = getSelectionCellBounds(api, { blockPadding });
    setFrozenBounds(snapshot);
    setPhase("recording");
    void (async () => {
      try {
        const result = await recordSelectionGif(api, {
          frames,
          ticksPerFrame,
          greenscreen,
          showMouse,
          limit1Mb,
          blockPadding,
          signal: abort.signal,
          onEncodeStart: () => setPhase("encoding"),
        });
        switch (result) {
          case "ok":
            api.ui.toast("GIF saved", {});
            break;
          case "ok-1mb":
            api.ui.toast("GIF saved — 1 MB limit", {});
            break;
          case "too-large":
            api.ui.toast("Selection too large for 1 MB — crop smaller", {});
            break;
          case "cancelled":
            api.ui.toast("GIF cancelled", {});
            break;
          case "no-selection":
            api.ui.toast("No marquee selection — press C, drag, then Record", {});
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

  useEffect(() => {
    if (!open && !recording) return;
    return installCaptureAreaPreview(() => ({
      blockPadding,
      recording,
      frozenBounds,
    }));
  }, [open, blockPadding, recording, frozenBounds]);

  if (!open) return null;

  const screenshotKey = sandkit.api.input.getDisplayKey(BINDINGS.screenshot);
  const recordGifKey = sandkit.api.input.getDisplayKey(BINDINGS.recordGif);

  return (
    <OverlayRoot>
      <FixedAnchor anchor="top-right">
        <Interactive>
          <OptionsPanel surface overlay className="min-w-[18rem]">
            <OptionsSection
              title={modinfo.name}
              first
              description={
                <>
                  Select with <HotkeyBadge>C</HotkeyBadge> the structure to capture.
                </>
              }
            >
              <OptionsRow label="Frames">
                <OptionsNumberInput
                  value={frames}
                  min={MIN_FRAMES}
                  max={MAX_FRAMES}
                  disabled={busy}
                  aria-label="Frames"
                  onChange={(value) =>
                    patchSettings({
                      frames: clampInt(value, MIN_FRAMES, MAX_FRAMES),
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
              <OptionsRow
                label="Block padding"
                description="Extra structure blocks around the selection."
              >
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
              <OptionsRow label="1 MB limit" description="Warning takes a while.">
                <OptionsSwitch
                  checked={limit1Mb}
                  disabled={busy}
                  onChange={(checked) => patchSettings({ limit1Mb: checked })}
                />
              </OptionsRow>
            </OptionsSection>
            <OptionsSection title="Actions">
              <OptionsRow
                label={
                  phase === "encoding"
                    ? "Encoding…"
                    : phase === "recording"
                      ? "Recording…"
                      : "Record GIF"
                }
              >
                <div className="flex items-center gap-2">
                  {!busy && recordGifKey ? <HotkeyBadge>{recordGifKey}</HotkeyBadge> : null}
                  <OptionsButton onClick={() => live.recordGif()}>
                    {busy ? "Cancel" : "Record"}
                  </OptionsButton>
                </div>
              </OptionsRow>
              <OptionsRow label="Screenshot">
                <div className="flex items-center gap-2">
                  {screenshotKey ? <HotkeyBadge>{screenshotKey}</HotkeyBadge> : null}
                  <OptionsButton disabled={busy} onClick={() => live.screenshot()}>
                    Copy PNG
                  </OptionsButton>
                </div>
              </OptionsRow>
            </OptionsSection>
          </OptionsPanel>
        </Interactive>
      </FixedAnchor>
    </OverlayRoot>
  );
}
