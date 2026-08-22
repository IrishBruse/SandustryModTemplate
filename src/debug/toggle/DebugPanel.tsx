import { useEffect, useState } from "react";
import {
  FixedAnchor,
  HotkeyBadge,
  Interactive,
  OverlayRoot,
  SectionHeading,
  UiBox,
} from "@modkit/ui";
import { safe } from "@modkit/utils";
import { settingOn } from "../settings";
import { syncEngineDebug } from "./enable-debug";

const api = sandkit.api;
const TOGGLE_CODE = "F3";

type StatusRow = {
  label: string;
  on: boolean;
};

function StatusList({ rows }: { rows: StatusRow[] }) {
  return (
    <ul className="text-sm space-y-1 mb-3 opacity-90">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center justify-between gap-4">
          <span>{row.label}</span>
          <span className={row.on ? "text-green-400" : "text-slate-400"}>
            {row.on ? "on" : "off"}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Top-left companion Debug panel.
 * F3 toggles it when **Debug panel (F3)** is on. Also keeps `debug.active` synced
 * so the vanilla Debug / Stats buttons stay available.
 */
export function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(() => settingOn(api, "engineDebug"));
  const [rows, setRows] = useState<StatusRow[]>([]);

  useEffect(() => {
    function refresh(): void {
      const on = settingOn(api, "engineDebug");
      setEnabled(on);
      syncEngineDebug(api);
      if (!on) setOpen(false);

      setRows([
        { label: "Engine debug.active", on },
        { label: "Disable autosave", on: settingOn(api, "disableAutosave") },
        { label: "F12 DevTools", on: settingOn(api, "f12DevTools") },
        { label: "Skip splash", on: settingOn(api, "skipSplash") },
        { label: "Auto-boot Continue", on: settingOn(api, "autoBoot") },
      ]);
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
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.code !== TOGGLE_CODE && event.key !== "F3") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen((value) => !value);
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [enabled]);

  if (!open || !enabled) return null;

  return (
    <OverlayRoot>
      <FixedAnchor anchor="top-left">
        <Interactive>
          <UiBox className="bg-black bg-opacity-85 p-4 shadow-lg card-2 w-[22rem] text-white">
            <div className="flex items-center justify-between gap-3 mb-2">
              <SectionHeading size="md">Debug</SectionHeading>
              <HotkeyBadge>F3</HotkeyBadge>
            </div>
            <p className="text-xs opacity-70 mb-3">
              Companion status. Vanilla Debug / Stats open the engine tools.
            </p>
            <StatusList rows={rows} />
            <p className="text-sm flex items-center gap-1 opacity-80">
              Press <HotkeyBadge>F3</HotkeyBadge> to close.
            </p>
          </UiBox>
        </Interactive>
      </FixedAnchor>
    </OverlayRoot>
  );
}
