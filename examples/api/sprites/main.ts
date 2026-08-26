import { modinfo } from "./modinfo";

const api = sandkit.api;

const SPRITE_ID = `${modinfo.id}:demo`;

async function main() {
  await api.sprites.loadFromMod(SPRITE_ID, "sprite.png");

  const sprite = api.sprites.getById(SPRITE_ID);
  const loaded = sprite !== undefined;

  api.ui.toast(`Sprites — loadFromMod ${loaded ? "ok" : "failed"}`, {});
  console.log(`loaded — sprites.getById(${SPRITE_ID})`, loaded ? "present" : "missing");
}

void main();
