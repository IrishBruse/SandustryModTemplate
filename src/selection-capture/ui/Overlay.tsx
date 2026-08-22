import { useCallback, useEffect, useState } from "react";
import {
  FixedAnchor,
  HotkeyBadge,
  Interactive,
  OverlayRoot,
  SectionHeading,
  UiBox,
} from "@modkit/ui";
import { captureSelectionPng } from "../capturePng";
import { MOD_ID } from "../globals";
import { recordSelectionGif } from "../recordGif";

const TOGGLE_CODE = "F7";
const SCREENSHOT_CODE = "F8";
const DEFAULT_FRAMES = 60;

/** Survives hot reload so F8 always calls the latest screenshot handler. */
type CaptureUi = { screenshot: () => void };
export const captureUi = ((
  globalThis as unknown as { __selectionCaptureUi?: CaptureUi }
).__selectionCaptureUi ??= {
  screenshot: () => undefined,
});

function parsePositiveInt(raw: string, fallback: number): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function Overlay() {
  const [open, setOpen] = useState(false);
  const [frames, setFrames] = useState(DEFAULT_FRAMES);
  const [ticksPerFrame, setTicksPerFrame] = useState(1);
  const [scale, setScale] = useState(2);
  const [busy, setBusy] = useState(false);

  const toggle = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  const screenshot = useCallback(() => {
    if (busy) return;
    const api = sandkit.api;
    void (async () => {
      try {
        const result = await captureSelectionPng(api);
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
        console.error(`[${MOD_ID}] PNG capture threw:`, error);
        api.ui.toast("Clipboard copy failed", {});
      }
    })();
  }, [busy]);

  useEffect(() => {
    captureUi.screenshot = screenshot;
  }, [screenshot]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.code === TOGGLE_CODE) {
        event.preventDefault();
        event.stopPropagation();
        toggle();
        return;
      }
      if (event.code === SCREENSHOT_CODE) {
        event.preventDefault();
        event.stopPropagation();
        captureUi.screenshot();
      }
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [toggle]);

  async function onRecord(): Promise<void> {
    if (busy) return;
    setBusy(true);
    const api = sandkit.api;
    try {
      const result = await recordSelectionGif(api, {
        frames,
        ticksPerFrame,
        scale,
      });
      switch (result) {
        case "ok":
          api.ui.toast("GIF saved and copied", {});
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
      console.error(`[${MOD_ID}] record threw:`, error);
      api.ui.toast("GIF record failed", {});
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const fieldClass =
    "w-full bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded border border-white border-opacity-20";

  return (
    <OverlayRoot>
      <FixedAnchor anchor="top-right">
        <Interactive>
          <UiBox className="bg-black bg-opacity-85 p-4 shadow-lg card-2 w-72 text-white">
            <SectionHeading size="md">Selection Capture</SectionHeading>
            <p className="text-sm opacity-80 mb-3">
              Select with <HotkeyBadge>C</HotkeyBadge>.<br />
              <HotkeyBadge>F8</HotkeyBadge> copies a PNG. <br />
              Press <HotkeyBadge>F7</HotkeyBadge> to close.
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
            <label className="block text-sm mb-3">
              Scale
              <select
                className={`${fieldClass} mt-1`}
                value={scale}
                disabled={busy}
                onChange={(event) => setScale(parsePositiveInt(event.target.value, 2))}
              >
                <option value={1}>1×</option>
                <option value={2}>2× (nearest)</option>
                <option value={4}>4× (nearest)</option>
              </select>
            </label>
            <button
              className="w-full text-sm tracking-wider bg-white bg-opacity-15 hover:bg-opacity-25 disabled:opacity-50 py-2 rounded"
              type="button"
              disabled={busy}
              onClick={() => {
                void onRecord();
              }}
            >
              {busy ? "Recording…" : "Record GIF"}
            </button>
            <button
              className="w-full text-sm tracking-wider bg-white bg-opacity-15 hover:bg-opacity-25 disabled:opacity-50 py-2 rounded mt-2"
              type="button"
              disabled={busy}
              onClick={() => {
                screenshot();
              }}
            >
              Screenshot
            </button>
          </UiBox>
        </Interactive>
      </FixedAnchor>
    </OverlayRoot>
  );
}
