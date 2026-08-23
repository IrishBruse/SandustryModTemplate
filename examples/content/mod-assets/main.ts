import { modinfo } from "./mod";

const api = sandkit.api;
const BADGE_URL = api.assets.getUrl("badge.png");
const INFO_URL = api.assets.getUrl("info.json");

void fetch(INFO_URL)
  .then((response) => response.json() as Promise<{ message?: string }>)
  .then((info) => {
    if (!reloaded) api.ui.toast(info.message ?? "Mod asset loaded", {});
    console.log(`${modinfo.id} assets`, { badgeUrl: BADGE_URL, info });
  })
  .catch((error) => {
    console.warn(`${modinfo.id} failed to load info.json`, error);
  });

console.log(`${reloaded ? "reloaded" : "loaded"} — badge at ${BADGE_URL}`);
