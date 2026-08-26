import { modinfo } from "./modinfo";

const api = sandkit.api;

const BINDING_PROMPT = `${modinfo.id}.prompt`;

api.input.registerBinding(BINDING_PROMPT, ["KeyU"], {
  displayName: "Show prompt",
  category: modinfo.name,
  handlers: {
    down: async () => {
      const value = await api.ui.prompt("Enter a label:", "Example", "text", "Prompt");
      if (typeof value !== "string" || !value.trim()) return;
      api.ui.toast(`Prompt — ${value.trim()}`, {});
    },
  },
});

const promptKey = api.input.getDisplayKey(BINDING_PROMPT, "U");

api.ui.toast(`UI Prompt — press ${promptKey} to open a dialog`, {});

console.log(`loaded — ui.prompt on binding ${BINDING_PROMPT} (${promptKey})`);
