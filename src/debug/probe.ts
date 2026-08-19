import type { RetroConsoleGame } from "types/retro-console";

export const exampleProbe: RetroConsoleGame = {
  id: "author-example-mod",
  name: "Example Probe",
  options: { width: 20, height: 14 },
  init(rc) {
    rc.clearScreen();
    for (let x = 0; x < rc.width; x++) rc.drawPixel(x, rc.height - 1);
    rc.drawPixel(3, 3);
    rc.drawPixel(4, 3);
    rc.drawPixel(5, 3);
    rc.drawPixel(6, 3);
    return { tick: 0, blink: true };
  },
  update(rc, state) {
    const s = state as { tick: number; blink: boolean };
    s.tick++;
    if (s.tick % 12 !== 0) return s;

    s.blink = !s.blink;
    rc.clearScreen();
    for (let x = 0; x < rc.width; x++) rc.drawPixel(x, rc.height - 1);
    if (s.blink) {
      rc.drawPixel(3, 3);
      rc.drawPixel(4, 3);
      rc.drawPixel(5, 3);
      rc.drawPixel(6, 3);
      rc.drawPixel(3, 4);
      rc.drawPixel(6, 4);
      rc.drawPixel(3, 5);
      rc.drawPixel(6, 5);
    }
    return s;
  },
  handleInput(rc, state, dir) {
    const x = 10 + dir.x;
    const y = 7 + dir.y;
    if (x >= 0 && x < rc.width && y >= 0 && y < rc.height) rc.drawPixel(x, y);
    return state;
  },
};
