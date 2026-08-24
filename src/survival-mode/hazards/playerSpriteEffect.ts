export type HazardKind = "fire" | "lava";

const WHITE = 0xffffff;
const FIRE_TINT = 0xff6622;
const LAVA_TINT = 0xff2200;

type Tintable = { tint?: number };

type PlayerSprites = {
  body?: Tintable;
  weapon?: Tintable;
  forearm?: Tintable;
};

let pulse = 0;

function playerSprites(): PlayerSprites | null {
  const session = sandkit.state.session as {
    rendering?: { pixi?: { sprites?: { player?: PlayerSprites } } };
  };
  return session.rendering?.pixi?.sprites?.player ?? null;
}

function lerpTint(from: number, to: number, mix: number): number {
  const fr = (from >> 16) & 0xff;
  const fg = (from >> 8) & 0xff;
  const fb = from & 0xff;
  const tr = (to >> 16) & 0xff;
  const tg = (to >> 8) & 0xff;
  const tb = to & 0xff;
  const r = Math.round(fr + (tr - fr) * mix);
  const g = Math.round(fg + (tg - fg) * mix);
  const b = Math.round(fb + (tb - fb) * mix);
  return (r << 16) | (g << 8) | b;
}

function setPartsTint(tint: number) {
  const sprites = playerSprites();
  if (!sprites) return;

  for (const part of [sprites.body, sprites.weapon, sprites.forearm]) {
    if (part && typeof part.tint === "number") {
      part.tint = tint;
    }
  }
}

/** Pulse the player body tint while touching fire or lava. */
export function updateHazardSpriteEffect(kind: HazardKind | null) {
  if (!kind) {
    pulse = 0;
    setPartsTint(WHITE);
    return;
  }

  pulse += 0.28;
  const base = kind === "lava" ? LAVA_TINT : FIRE_TINT;
  const mix = 0.5 + 0.5 * Math.sin(pulse);
  setPartsTint(lerpTint(WHITE, base, mix));
}

export function clearHazardSpriteEffect() {
  updateHazardSpriteEffect(null);
}
