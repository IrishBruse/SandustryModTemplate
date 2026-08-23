import { registerRetroGame } from "@modkit/utils";

const WIDTH = 160;
const HEIGHT = 100;

/** Stable hash noise in 0..1. No Math.random flicker. */
function noise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 0.017) * 43758.5453;
  return n - Math.floor(n);
}

function registerNoiseTest() {
  const registered = registerRetroGame({
    id: "noise-test",
    name: "Noise Test",
    options: { width: WIDTH, height: HEIGHT },
    init(display) {
      display.clearScreen(false);
      return {
        tick: 0,
        threshold: 0.5,
        seed: 0,
        animate: true,
      };
    },
    update(display, state) {
      const { width, height } = display;
      const seed = state.animate ? state.seed + state.tick : state.seed;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          display.drawPixel(x, y, noise(x, y, seed) < state.threshold);
        }
      }
      return { ...state, tick: state.tick + 1 };
    },
    handleInput(_display, state, input) {
      let { threshold, seed, animate } = state;
      if (input.x < 0) threshold = Math.max(0.05, threshold - 0.05);
      if (input.x > 0) threshold = Math.min(0.95, threshold + 0.05);
      if (input.y < 0) animate = !animate;
      if (input.y > 0) seed += 25;
      console.log(`noise: threshold=${threshold.toFixed(2)} seed=${seed} animate=${animate}`);
      return { ...state, threshold, seed, animate };
    },
  });
  if (!registered) return;
  console.log(`Noise test registered at ${WIDTH}x${HEIGHT}`);
}

registerNoiseTest();

console.log(`${reloaded ? "reloaded" : "loaded"} — open Retro Console for Noise Test`);
