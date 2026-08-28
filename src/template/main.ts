const api = sandkit.api;
const { createElement: h } = sandkit.react;

const INJECT_PROBE = "Template inject";
const HOTBAR_PROBE = "Template hotbar";

api.ui.toast("Template loaded", {});

api.ui.inject("author.template", function TemplateOverlay() {
  return h("div", { "data-hot-reload-probe": "inject" }, INJECT_PROBE);
});

api.ui.overlays.register("hotbar", "author.template", function TemplateHotbar() {
  return h("span", { "data-hot-reload-probe": "hotbar" }, HOTBAR_PROBE);
});

console.log("loaded — template");
