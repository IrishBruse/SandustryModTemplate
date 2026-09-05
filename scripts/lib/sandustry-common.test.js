import assert from "node:assert/strict";
import test from "node:test";
import { pickSandustryMonitor } from "./sandustry-common.js";

/** @type {import("./sandustry-common.js").SandustryMonitor[]} */
const monitors = [
  { name: "HDMI-1", x: 0, y: 0, w: 1920, h: 1080, primary: true },
  { name: "DP-1", x: 1920, y: 0, w: 2560, h: 1440, primary: false },
];

test("pickSandustryMonitor left returns first sorted monitor", () => {
  assert.equal(pickSandustryMonitor(monitors, "left").name, "HDMI-1");
});

test("pickSandustryMonitor right returns last sorted monitor", () => {
  assert.equal(pickSandustryMonitor(monitors, "right").name, "DP-1");
});

test("pickSandustryMonitor primary returns flagged monitor", () => {
  assert.equal(pickSandustryMonitor(monitors, "primary").name, "HDMI-1");
});

test("pickSandustryMonitor index selects by position", () => {
  assert.equal(pickSandustryMonitor(monitors, "1").name, "DP-1");
});

test("pickSandustryMonitor empty spec uses primary", () => {
  assert.equal(pickSandustryMonitor(monitors, "").name, "HDMI-1");
});

test("pickSandustryMonitor unknown spec falls back to primary", () => {
  assert.equal(pickSandustryMonitor(monitors, "center").name, "HDMI-1");
});
