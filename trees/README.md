# Trees

Pine trees, harvested wood, and charcoal for Sandustry.

## Use

1. Enable the mod and load a save.
2. **Debug menu:** equip the Debug tool → **Element** brush → **Pine Seed**.
3. Drop a seed onto **Wet Sand**. The wet sand becomes **Sand**. A pine grows up 48 cells. The trunk is **Pine Wood terrain**, 3 cells wide.
4. Needles grow as a wide cone. The tip sits 3 cells above the wood. The shoot stays on the trunk.
5. Mine any **trunk** cell with a shovel or drill. The rest of the trunk falls as **Raw Wood**. Needles fall as **Leaf Dust**.
6. Burn a sealed pile of Raw Wood (no empty cells in the 8 neighbors) to make **Charcoal**. Open flame makes vanilla burnt residue and steam.
7. Leaf Dust that rests in place becomes **Dirt**.

Old trees from 0.1.0 are static elements. Plant a new seed after you reload.

## Kiln (manual)

1. Pile Raw Wood on a floor.
2. Ignite it with a flamethrower or spark.
3. Cover every neighbor, including diagonals, with sand, soil, or other solids.
4. Dig the pile. Harvest Charcoal.

## Factory (vanilla parts)

No extra machines. Use conveyors, sensors, drills, pistons, and hoppers.

- **Tree farm:** a sensor above a mature canopy fires a drill at the trunk. Catch falling Raw Wood in a hopper.
- **Kiln chute:** drop Raw Wood down a shaft. Spark at the intake. Keep the shaft sealed (no empty diagonal cells). Gate Charcoal onto a belt below.

## Options

- **Mod enabled** — turn pine trees, wood, and charcoal off.

## Dev

```bash
npm run dev -- --mod trees
```

Hard-reload Sandustry after the bundle writes.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
