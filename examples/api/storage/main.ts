import { modinfo } from "./modinfo";

const api = sandkit.api;

const bag = api.storage.ensure(modinfo.id);
const loadCount = typeof bag.loadCount === "number" ? bag.loadCount + 1 : 1;

bag.loadCount = loadCount;
api.storage.set(modinfo.id, "lastLoadedAt", Date.now());

api.ui.toast(`Storage — save load count ${loadCount}`, {});

console.log(`loaded — storage.ensure(${modinfo.id})`, bag);
