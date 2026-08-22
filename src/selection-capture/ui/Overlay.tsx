import { useCallback, useEffect, useRef, useState } from "react";
import {
  FixedAnchor,
  HotkeyBadge,
  Interactive,
  OverlayRoot,
  SectionHeading,
  UiBox,
} from "@modkit/ui";
import { captureSelectionPng } from "../capturePng";
import { modinfo } from "../mod";
import { recordSelectionGif } from "../recordGif";

/** Game `registerBinding` forwards `displayNameKey`, not `displayName`. */
const BINDINGS = {
  togglePanel: `${modinfo.id}.togglePanel`,
  screenshot: `${modinfo.id}.screenshot`,
  recordGif: `${modinfo.id}.recordGif`,
} as const;

const DEFAULT_FRAMES = 60;

function parsePositiveInt(raw: string, fallback: number): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

type PillToggleProps = {
  label: string;
  checked: boolean;
  disabled?: boolean;
  className?: string;
  onChange: (checked: boolean) => void;
};

/** Flat yellow/gray pill switch — native checkbox under the hood. */
function PillToggle({ label, checked, disabled, className = "", onChange }: PillToggleProps) {
  return (
    <label
      className={`flex items-center justify-between gap-3 text-sm ${disabled ? "opacity-50" : ""} ${className}`}
    >
      <span>{label}</span>
      <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
        <input
          className="absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span
          className={`pointer-events-none absolute inset-0 rounded-full transition-colors ${
            checked ? "bg-[#FFD700]" : "bg-[#373D48]"
          }`}
          aria-hidden
        />
        <span
          className={`pointer-events-none absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
          aria-hidden
        />
      </span>
    </label>
  );
}

export function Overlay() {
  const [open, setOpen] = useState(false);
  const [frames, setFrames] = useState(DEFAULT_FRAMES);
  const [ticksPerFrame, setTicksPerFrame] = useState(1);
  const [greenscreen, setGreenscreen] = useState(false);
  const [showMouse, setShowMouse] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  const screenshot = useCallback(() => {
    if (busy) return;
    const api = sandkit.api;
    void (async () => {
      try {
        const result = await captureSelectionPng(api, { greenscreen, showMouse });
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
  }, [busy, greenscreen, showMouse]);

  const recordGif = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    const api = sandkit.api;
    try {
      const result = await recordSelectionGif(api, {
        frames,
        ticksPerFrame,
        greenscreen,
        showMouse,
      });
      switch (result) {
        case "ok":
          api.ui.toast("GIF saved", {});
          break;
        case "downloaded":
          api.ui.toast("GIF saved — check your downloads", {});
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
      setBusy(false);
    }
  }, [busy, frames, greenscreen, showMouse, ticksPerFrame]);

  const toggleRef = useRef(toggle);
  const screenshotRef = useRef(screenshot);
  const recordGifRef = useRef(recordGif);
  toggleRef.current = toggle;
  screenshotRef.current = screenshot;
  recordGifRef.current = recordGif;

  useEffect(() => {
    const api = sandkit.api;
    const category = modinfo.name;

    api.input.registerBinding(BINDINGS.togglePanel, ["F7"], {
      displayName: "Toggle panel",
      displayNameKey: "Toggle panel",
      category,
      handlers: { down: () => toggleRef.current() },
    });
    api.input.registerBinding(BINDINGS.screenshot, [], {
      displayName: "Screenshot",
      displayNameKey: "Screenshot",
      category,
      handlers: { down: () => screenshotRef.current() },
    });
    api.input.registerBinding(BINDINGS.recordGif, [], {
      displayName: "Record GIF",
      displayNameKey: "Record GIF",
      category,
      handlers: { down: () => void recordGifRef.current() },
    });
  }, []);

  if (!open) return null;

  const toggleKey = sandkit.api.input.getDisplayKey(BINDINGS.togglePanel, "F7");
  const screenshotKey = sandkit.api.input.getDisplayKey(BINDINGS.screenshot);
  const recordGifKey = sandkit.api.input.getDisplayKey(BINDINGS.recordGif);
  const fieldClass = "w-full bg-black text-white text-sm px-2 py-1 rounded border border-white/20";
  const actionButtonClass =
    "w-full text-sm tracking-wider bg-white bg-opacity-15 hover:bg-opacity-25 disabled:opacity-50 py-2 px-2 rounded flex items-center justify-center gap-2";

  return (
    <OverlayRoot>
      <FixedAnchor anchor="top-right">
        <Interactive>
          <UiBox className="bg-black p-4 shadow-lg card-2 w-72 text-white">
            <SectionHeading size="md">{modinfo.name}</SectionHeading>
            <p className="text-sm opacity-80 mb-3">
              Select with <HotkeyBadge>C</HotkeyBadge>.<br />
              Press <HotkeyBadge>{toggleKey}</HotkeyBadge> to close.
            </p>
            <label className="block text-sm mb-2">
              Frames
              <input
                className={`${fieldClass} mt-1`}
                type="number"
                min={2}
                max={120}
                value={frames}
                disabled={busy}
                onChange={(event) =>
                  setFrames(parsePositiveInt(event.target.value, DEFAULT_FRAMES))
                }
              />
            </label>
            <label className="block text-sm mb-2">
              Ticks / frame
              <input
                className={`${fieldClass} mt-1`}
                type="number"
                min={1}
                max={30}
                value={ticksPerFrame}
                disabled={busy}
                onChange={(event) => setTicksPerFrame(parsePositiveInt(event.target.value, 1))}
              />
            </label>
            <PillToggle
              className="mb-2"
              label="Greenscreen"
              checked={greenscreen}
              disabled={busy}
              onChange={setGreenscreen}
            />
            <PillToggle
              className="mb-3"
              label="Show mouse"
              checked={showMouse}
              disabled={busy}
              onChange={setShowMouse}
            />
            <button
              className={actionButtonClass}
              type="button"
              disabled={busy}
              onClick={() => {
                void recordGif();
              }}
            >
              <span>{busy ? "Recording…" : "Record GIF"}</span>
              {!busy && recordGifKey ? <HotkeyBadge>{recordGifKey}</HotkeyBadge> : null}
            </button>
            <button
              className={`${actionButtonClass} mt-2`}
              type="button"
              disabled={busy}
              onClick={() => {
                screenshot();
              }}
            >
              <span>Screenshot</span>
              {screenshotKey ? <HotkeyBadge>{screenshotKey}</HotkeyBadge> : null}
            </button>
          </UiBox>
        </Interactive>
      </FixedAnchor>
    </OverlayRoot>
  );
}
