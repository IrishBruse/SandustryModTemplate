import { useEffect, useState } from "react";
import {
  FixedAnchor,
  HotkeyBadge,
  Interactive,
  ManagementMenuButton,
  OverlayRoot,
  SectionHeading,
  UiBox,
} from "../../ui";
import { sandkit } from "../../sandkit";
import { inGame } from "../../sdk/scene";
import { safe } from "../../sdk/safe";
import {
  BOOT_FLAGS,
  DEBUG_FLAGS,
  applyAllFlags,
  debugMenuButtonEnabled,
  initFlagsFromSettings,
  onDebugSettingsChange,
  readFlag,
  setFlag,
} from "./flags";

const api = sandkit.api;

const TOGGLE_CODE = "F3";

function DebugIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
    >
      <path d="M12 2a2 2 0 0 1 2 2v1.1a7.02 7.02 0 0 1 2.45 1.01l.78-.78a2 2 0 1 1 2.83 2.83l-.78.78A7.02 7.02 0 0 1 19.9 10H21a2 2 0 1 1 0 4h-1.1a7.02 7.02 0 0 1-1.01 2.45l.78.78a2 2 0 1 1-2.83 2.83l-.78-.78A7.02 7.02 0 0 1 14 18.9V20a2 2 0 1 1-4 0v-1.1a7.02 7.02 0 0 1-2.45-1.01l-.78.78a2 2 0 1 1-2.83-2.83l.78-.78A7.02 7.02 0 0 1 4.1 14H3a2 2 0 1 1 0-4h1.1a7.02 7.02 0 0 1 1.01-2.45l-.78-.78a2 2 0 1 1 2.83-2.83l.78.78A7.02 7.02 0 0 1 10 5.1V4a2 2 0 0 1 2-2zm0 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    </svg>
  );
}

type DebugToggleOverlayProps = {
  modId: string;
};

/**
 * Dev-only Debug management row + F3 panel for engine debug flags.
 * F3 always works; the sidebar row can be hidden via `debugMenuButton`.
 */
export function DebugToggleOverlay({ modId }: DebugToggleOverlayProps) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(() => inGame());
  const [showMenuButton, setShowMenuButton] = useState(() => debugMenuButtonEnabled(api));
  const [flagEpoch, setFlagEpoch] = useState(0);

  function refreshFlags() {
    setFlagEpoch((n) => n + 1);
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaying(inGame());
      setShowMenuButton(debugMenuButtonEnabled(api));
    }, 500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    initFlagsFromSettings(api);
    const stop = safe(() =>
      api.settings.onChange((values: Readonly<Record<string, unknown>>) => {
        setShowMenuButton(debugMenuButtonEnabled(api));
        onDebugSettingsChange(api, values, true);
        refreshFlags();
      }),
    );
    return () => stop?.();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== TOGGLE_CODE && event.key !== "F3") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen((value) => !value);
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  const rowId = `${modId}:debug-menu`;

  return (
    <>
      <ManagementMenuButton
        id={rowId}
        icon={<DebugIcon />}
        label="Debug"
        hotkey="F3"
        active={playing && showMenuButton}
        onClick={() => setOpen((value) => !value)}
      />
      {open ? (
        <OverlayRoot>
          <FixedAnchor anchor="top-left" style={{ top: "1rem", left: "15rem" }}>
            <Interactive>
              <UiBox className="bg-black bg-opacity-85 p-4 shadow-lg card-2 w-[22rem] text-white">
                <SectionHeading size="md">Debug</SectionHeading>
                <p className="text-sm opacity-80 mb-3">
                  Engine debug flags. Boot flags need a restart. Press <HotkeyBadge>F3</HotkeyBadge>{" "}
                  to close.
                </p>
                <ul className="flex flex-col gap-2 mb-3" key={flagEpoch}>
                  {DEBUG_FLAGS.map((entry) => {
                    const on = readFlag(api, entry.setting, false);
                    const boot = (BOOT_FLAGS as readonly string[]).includes(entry.flag);
                    return (
                      <li key={entry.setting}>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-tr-md rounded-bl-md bg-black bg-opacity-40 hover:bg-opacity-60 text-left"
                          onClick={() => {
                            safe(() => api.sound.play("click"));
                            setFlag(api, entry.setting, !on, true);
                            refreshFlags();
                          }}
                        >
                          <span className="text-sm">
                            {entry.label}
                            {boot ? <span className="opacity-60 text-xs ml-2">restart</span> : null}
                          </span>
                          <span
                            className={`text-xs font-semibold ${on ? "text-[#ffe700]" : "opacity-50"}`}
                          >
                            {on ? "ON" : "OFF"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <button
                  type="button"
                  className="text-sm underline opacity-80 hover:opacity-100"
                  onClick={() => {
                    applyAllFlags(api, true);
                    refreshFlags();
                  }}
                >
                  Re-apply all
                </button>
              </UiBox>
            </Interactive>
          </FixedAnchor>
        </OverlayRoot>
      ) : null}
    </>
  );
}
