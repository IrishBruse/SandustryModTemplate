import modinfo from "./modinfo.json";

const api = sandkit.api;

const GREETING_KEY = `${modinfo.id}.greeting`;

api.i18n.register("en", {
  [GREETING_KEY]: "Hello from i18n",
});

api.ui.toast(api.i18n.t(GREETING_KEY), {});

console.log(`loaded — i18n.t(${GREETING_KEY}) = ${api.i18n.t(GREETING_KEY)}`);
