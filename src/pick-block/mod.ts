import { defineModInfo } from "@modkit/modinfo";

export { patches } from "./patches";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "irishbruse.pick-block",
  name: "Instant Pick Block",
  version: "1.0.0",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description: "Press the Picker key once to pick the structure under the cursor.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn instant pick block off and restore vanilla Picker behavior.",
    },
  },
});
