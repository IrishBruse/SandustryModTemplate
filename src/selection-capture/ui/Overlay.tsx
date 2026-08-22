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
import { modinfo } from "../mod";
import { recordSelectionGif } from "../recordGif";

const TOGGLE_CODE = "F7";
const DEFAULT_FRAMES = 60;

function parsePositiveInt(raw: string, fallback: number): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function Overlay() {
  const [open, setOpen] = useState(false);
  const [frames, setFrames] = useState(DEFAULT_FRAMES);
  const [ticksPerFrame, setTicksPerFrame] = useState(1);
  const [greenscreen, setGreenscreen] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  const screenshot = useCallback(() => {
    if (busy) return;
    const api = sandkit.api;
    void (async () => {
      try {
        const result = await captureSelectionPng(api, { greenscreen });
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
  }, [busy, greenscreen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.code !== TOGGLE_CODE) return;
      event.preventDefault();
      event.stopPropagation();
      toggle();
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
        greenscreen,
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
      console.error(`[${MOD_ID}] record threw:`, error);
      api.ui.toast("GIF record failed", {});
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const fieldClass = "w-full bg-black text-white text-sm px-2 py-1 rounded border border-white/20";

  return (
    <OverlayRoot>
      <FixedAnchor anchor="top-right">
        <Interactive>
          <UiBox className="bg-black p-4 shadow-lg card-2 w-72 text-white">
            <SectionHeading size="md">{modinfo.name}</SectionHeading>
            <p className="text-sm opacity-80 mb-3">
              Select with <HotkeyBadge>C</HotkeyBadge>.<br />
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
            <label className="flex items-center gap-2 text-sm mb-3">
              <input
                type="checkbox"
                checked={greenscreen}
                disabled={busy}
                onChange={(event) => setGreenscreen(event.target.checked)}
              />
              Greenscreen
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
