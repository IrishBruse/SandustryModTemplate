import { defineModInfo } from "@modkit/modinfo";

/**
 * Showcase every `configSchema` field type the game accepts:
 * `boolean`, `number`, and `choice`.
 *
 * Open Options → Mods → Settings to edit these in the UI.
 * See `docs/modkit/config-schema.md`.
 */
export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.settings",
  name: "Settings",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description:
    "Shows every configSchema field type (boolean, number, choice) and reacts to settings.onChange.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn the mod off without unsubscribing.",
    },
    showToast: {
      type: "boolean",
      default: true,
      labelKey: "Toast on change",
      descriptionKey: "Show a toast when any setting below changes.",
    },
    volume: {
      type: "number",
      default: 50,
      min: 0,
      max: 100,
      step: 5,
      labelKey: "Volume (slider)",
      descriptionKey: "Number with min and max — Options shows a range slider plus a number box.",
    },
    retryCount: {
      type: "number",
      default: 3,
      labelKey: "Retry count (number only)",
      descriptionKey: "Number without min/max — Options shows a number box only.",
    },
    priority: {
      type: "choice",
      default: "normal",
      labelKey: "Priority",
      descriptionKey: "Choice field — Options shows a select list.",
      options: [
        { value: "low", labelKey: "Low" },
        { value: "normal", labelKey: "Normal" },
        { value: "high", labelKey: "High" },
      ],
    },
  },
});
