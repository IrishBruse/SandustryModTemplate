import { safe } from "@modkit/utils";
import { modinfo } from "./mod";

const api = sandkit.api;

type SettingSnapshot = {
  showToast: boolean;
  volume: number;
  retryCount: number;
  priority: string;
};

function readSettings(): SettingSnapshot {
  const showToast = safe(() => api.settings.get("showToast"));
  const volume = safe(() => api.settings.get("volume"));
  const retryCount = safe(() => api.settings.get("retryCount"));
  const priority = safe(() => api.settings.get("priority"));
  return {
    showToast: typeof showToast === "boolean" ? showToast : true,
    volume: typeof volume === "number" ? volume : 50,
    retryCount: typeof retryCount === "number" ? retryCount : 3,
    priority: typeof priority === "string" ? priority : "normal",
  };
}

function formatSnapshot(values: SettingSnapshot): string {
  return `toast=${values.showToast} volume=${values.volume} retries=${values.retryCount} priority=${values.priority}`;
}

function notify(message: string, values: SettingSnapshot) {
  console.log(message, values);
  if (values.showToast) {
    api.ui.toast(message, {});
  }
}

const initial = readSettings();
notify(`Settings loaded — ${formatSnapshot(initial)}`, initial);

api.settings.onChange(() => {
  const next = readSettings();
  notify(`Settings changed — ${formatSnapshot(next)}`, next);
});

console.log(`${reloaded ? "reloaded" : "loaded"} — edit Options → Mods → ${modinfo.name}`);
