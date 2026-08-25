import { modinfo } from "./modinfo";

const api = sandkit.api;

const BINDING_TOAST = `${modinfo.id}.toast`;

api.input.registerBinding(BINDING_TOAST, ["KeyT"], {
  displayName: "Show toast",
  category: modinfo.name,
  handlers: {
    down: () => {
      api.ui.toast("Input binding fired", {});
    },
  },
});

const toastKey = api.input.getDisplayKey(BINDING_TOAST, "T");

api.ui.toast(`Input Binding — press ${toastKey} for a toast`, {});

console.log(
  `loaded — toast binding ${BINDING_TOAST} (${toastKey}). Rebind under Options → Controls`,
);
