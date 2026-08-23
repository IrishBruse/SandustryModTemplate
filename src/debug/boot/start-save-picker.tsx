import { useEffect, useState, type CSSProperties } from "react";
import { onDispose } from "@modkit/debug";
import { registerManagementMenuButton } from "@modkit/ui";
import { inGame } from "@modkit/utils";
import {
  AUTO_LOAD_FROM_STORAGE,
  AUTO_LOAD_LAST_PLAYED,
  getStartSaveSetting,
  getStorageSaveId,
  listSaveFiles,
  saveFileLabel,
  setStorageSaveId,
  type SaveFileInfo,
} from "./auto-load-save";

const api = sandkit.api;
const TOGGLE_EVENT = "irishbruse.debug:toggle-start-save";
const SAVE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor"><path d="M160-160v-640h480l160 160v480H160Zm80-80h480v-354L594-720H240v480Zm0 0v-480 480Zm80-80h80v-240H320v240Zm160 0h80v-80h-80v80Zm0-160h80v-80h-80v80Z"/></svg>';

const panelStyle: CSSProperties = {
  position: "fixed",
  top: 8,
  right: 8,
  zIndex: 10010,
  minWidth: 240,
  maxWidth: 360,
  padding: "8px 10px",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  border: "1px solid #4b5563",
  borderRadius: 8,
  color: "#fff",
  fontSize: 13,
  pointerEvents: "auto",
};

const selectStyle: CSSProperties = {
  width: "100%",
  marginTop: 6,
  padding: "4px 6px",
  backgroundColor: "#111",
  color: "#fff",
  border: "1px solid #6b7280",
  borderRadius: 4,
};

function pickerValue(): string {
  const pref = getStartSaveSetting(api);
  if (pref === AUTO_LOAD_LAST_PLAYED) return AUTO_LOAD_LAST_PLAYED;
  if (pref === AUTO_LOAD_FROM_STORAGE) {
    return getStorageSaveId(api) ?? AUTO_LOAD_LAST_PLAYED;
  }
  return pref;
}

function StartSavePickerOverlay() {
  const [open, setOpen] = useState(() => !inGame());
  const [playing, setPlaying] = useState(() => inGame());
  const [saves, setSaves] = useState<SaveFileInfo[]>([]);
  const [value, setValue] = useState(pickerValue);

  useEffect(() => {
    function onToggle(): void {
      setOpen((current) => !current);
    }
    window.addEventListener(TOGGLE_EVENT, onToggle);
    return () => window.removeEventListener(TOGGLE_EVENT, onToggle);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = inGame();
      setPlaying(now);
      if (!now) setOpen(true);
    }, 400);
    return () => window.clearInterval(id);
  }, []);

  const visible = !playing || open;

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    void listSaveFiles().then((files) => {
      if (!cancelled) setSaves(files);
    });
    setValue(pickerValue());
    const stop = api.settings.onChange(() => setValue(pickerValue()));
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [visible]);

  if (!visible) return null;

  const extra =
    value !== AUTO_LOAD_LAST_PLAYED && !saves.some((file) => file.id === value)
      ? [{ id: value, name: value }]
      : [];
  const lastPlayed = getStartSaveSetting(api) === AUTO_LOAD_LAST_PLAYED;

  return (
    <div style={panelStyle}>
      <div>Start save</div>
      <select
        style={selectStyle}
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          setStorageSaveId(api, next === AUTO_LOAD_LAST_PLAYED ? null : next);
          setValue(next === AUTO_LOAD_LAST_PLAYED ? AUTO_LOAD_LAST_PLAYED : next);
        }}
      >
        <option value={AUTO_LOAD_LAST_PLAYED}>Last played</option>
        {[...extra, ...saves].map((file) => (
          <option key={file.id} value={file.id}>
            {saveFileLabel(file)}
          </option>
        ))}
      </select>
      {lastPlayed ? (
        <div style={{ marginTop: 6, fontSize: 11, opacity: 0.8 }}>
          Options → Start save is Last played. Choose Mod storage to use this list.
        </div>
      ) : null}
    </div>
  );
}

/** Overlay + management-column row. Writes `api.storage` (settings cannot list live saves). */
export function installStartSavePicker(modId: string): void {
  const dispose = api.ui.inject(`${modId}:start-save`, () => <StartSavePickerOverlay />);
  if (!dispose) {
    console.warn(`[${modId}] Start save picker registration failed`);
    return;
  }
  onDispose(dispose);

  const stopRow = registerManagementMenuButton({
    id: `${modId}:start-save`,
    icon: SAVE_ICON,
    label: "Start save",
    hotkey: "",
    onClick: () => window.dispatchEvent(new Event(TOGGLE_EVENT)),
  });
  onDispose(stopRow);
}
