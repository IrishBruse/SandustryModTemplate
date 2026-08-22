import { defineModInfo } from "@modkit/modinfo";

export const { modinfo, MOD_ID } = defineModInfo({
  manifestVersion: 1,
  id: "author.worker-api-example",
  name: "Worker API Example",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  workerEntry: "worker.js",
  author: "Your Name",
  description: "Probes worker-thread sandkit.api so types can be checked against the live bag.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn the mod off without unsubscribing.",
    },
  },
});
