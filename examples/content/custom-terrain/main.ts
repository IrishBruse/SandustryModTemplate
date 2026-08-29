import modinfo from "./modinfo.json";

const api = sandkit.api;

const TERRAIN_ID = `${modinfo.id}:chalk`;

const { cellType } = api.terrains.register({
  id: TERRAIN_ID,
  name: "Example Chalk",
  hp: 50,
  colorHSL: [0, 0, 0.92],
  materialId: 120,
});

api.discoveries.addTerrainByType(cellType);

api.ui.toast("Custom Terrain — Debug → Terrain → Example Chalk", {});

console.log(`loaded — terrains.register(${TERRAIN_ID}) cellType ${cellType}`);
