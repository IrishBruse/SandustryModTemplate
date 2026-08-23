import { useEffect, useState, type CSSProperties } from "react";
import { onDispose } from "@modkit/debug";
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
  const [playing, setPlaying] = useState(() => inGame());
  const [saves, setSaves] = useState<SaveFileInfo[]>([]);
  const [value, setValue] = useState(pickerValue);

  useEffect(() => {
    const id = window.setInterval(() => setPlaying(inGame()), 400);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (playing) return;
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
  }, [playing]);

  if (playing) return null;

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

/** Menu overlay. Writes `api.storage` (settings cannot list live saves). Hidden in-game. */
export function installStartSavePicker(modId: string): void {
  const dispose = api.ui.inject(`${modId}:start-save`, () => <StartSavePickerOverlay />);
  if (!dispose) {
    console.warn(`[${modId}] Start save picker registration failed`);
    return;
  }
  onDispose(dispose);
}
