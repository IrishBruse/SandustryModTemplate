import { renderHotbar, TemplateOverlay } from "./ui/Overlay.tsx";

const api = sandkit.api;

api.ui.toast("Template loaded", {});

api.ui.inject("author.template", TemplateOverlay);
api.ui.overlays.register("hotbar", "author.template", renderHotbar);

api.input.registerBinding("author.template.ping", ["F13"], {
  displayName: "Template ping",
  category: "Template",
  handlers: {
    down: function () {
      api.ui.toast("Template ping", {});
    },
  },
});

console.log("loaded — template");
