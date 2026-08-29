import modinfo from "./modinfo.json";

const api = sandkit.api;

const STRUCTURE_ID = `${modinfo.id}:beacon`;
const SPRITE_ID = `${modinfo.id}:beacon-sprite`;

async function main() {
  await api.sprites.loadFromMod(SPRITE_ID, "beacon.png");

  api.structures.register({
    id: STRUCTURE_ID,
    name: "Example Beacon",
    categoryKey: "logistics",
    buildModes: [{ type: "single" }],
    variants: [{ id: STRUCTURE_ID, angles: [0] }],
    render: {
      imageName: SPRITE_ID,
      size: { width: 16, height: 16 },
    },
    shape: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ],
  });

  api.ui.toast("Register Structure — use Debug → Building to place the beacon", {});
  console.log(`loaded — structures.register(${STRUCTURE_ID})`);
}

void main();
