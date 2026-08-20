import { useEffect, useState } from "react";
import { ManagementMenuButton } from "../../ui";
import { sandkit } from "../../sandkit";
import { debugEnabled } from "../../utils/settings";
import { inGame } from "../../utils/scene";
import { safe } from "../../utils/safe";
import { syncEngineDebug } from "./enable-debug";
import { hideEngineDebugButtons, toggleEngineDebugPanel } from "./native-panel";

const api = sandkit.api;

const TOGGLE_CODE = "F3";

function DebugIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      width="20"
      viewBox="0 -960 960 960"
      fill="currentColor"
    >
      <path d="M480-200q66 0 113-47t47-113v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160q0 66 47 113t113 47Zm-80-120h160v-80H400v80Zm0-160h160v-80H400v80Zm80 40Zm0 320q-65 0-120.5-32T272-240H160v-80h84q-3-20-3.5-40t-.5-40h-80v-80h80q0-20 .5-40t3.5-40h-84v-80h112q14-23 31.5-43t40.5-35l-64-66 56-56 86 86q28-9 57-9t57 9l88-86 56 56-66 66q23 15 41.5 34.5T688-640h112v80h-84q3 20 3.5 40t.5 40h80v80h-80q0 20-.5 40t-3.5 40h84v80H688q-32 56-87.5 88T480-120Z" />
    </svg>
  );
}

type DebugToggleOverlayProps = {
  modId: string;
};

/**
 * Dev-only Debug management row + F3.
 * Gated by the mod **Debug** setting. When that is on, engine `debug.active`
 * stays on and F3 / the row open the engine Debug window.
 */
export function DebugToggleOverlay({ modId }: DebugToggleOverlayProps) {
  const [playing, setPlaying] = useState(() => inGame());
  const [debugOn, setDebugOn] = useState(() => debugEnabled(api));

  useEffect(() => {
    function refresh(): void {
      setPlaying(inGame());
      const on = debugEnabled(api);
      setDebugOn(on);
      syncEngineDebug(api);
      if (on) hideEngineDebugButtons();
    }

    refresh();
    const timer = window.setInterval(refresh, 500);
    const stop = safe(() => api.settings.onChange(() => refresh()));
    return () => {
      window.clearInterval(timer);
      stop?.();
    };
  }, []);

  useEffect(() => {
    if (!debugOn) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== TOGGLE_CODE && event.key !== "F3") return;
      event.preventDefault();
      event.stopPropagation();
      toggleEngineDebugPanel();
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [debugOn]);

  const rowId = `${modId}:debug-menu`;

  return (
    <ManagementMenuButton
      id={rowId}
      icon={<DebugIcon />}
      label="Debug"
      hotkey="F3"
      active={playing && debugOn}
      onClick={() => toggleEngineDebugPanel()}
    />
  );
}
