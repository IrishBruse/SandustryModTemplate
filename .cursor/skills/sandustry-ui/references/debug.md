# Debug

HUD **Debug**, or **F3** if Hot Reload F3 overlay is on. Header **DEBUG**, Elem live/cap, close X.

Tabs: Spawn, Overlays, Lighting, Game, Audio, Sim, Stats.

Story **Trigger Step** / **Finish Step** and **MAX EVERYTHING** only when asked.

## Spawn

Brush size minus/plus, presets 1-100, Circle/Square. Overwrite, Skip physics, Highlight brush, Prevent duplicates. Throttle 0-2000 ms. Paint: Elements, Ground.

## Overlays

Disable Structure Rendering. Cell inspector. Lights overlay. Filter overlays. Authorization zone overlay.

## Lighting

Light Size, Terrain Shadow Value. Flashlight Brightness, Size, Duration. Bad displays need `config.debug.badDisplays = true` then reload.

## Game

Weapons: flamethrower, rocket, gun, shotgun, megashotgun, teleporter, vacuum, digger, thruster.

Triggers / foliage / cheats / Hide UI / Verify Positions / Codex / Copy API Markdown / Randomize Tech Colors / Set Level / Simulate Artifact Pickup.

Story steps this save: establish_wet_sand_processing, establish_burnt_residue_processing, investigate_anomaly, retrieve_void_orb, establish_peak_energy, secure_stratacore, resume_factory_expansion, produce_auralite, saturate_aura_field, authorize_aura_expansion.

## Screenshot / GIF recorder

Overlay (not a Debug tab). A11y title **SCREENSHOT AND GIF RECORDER**. Opens from in-game tooling (exact menu path not walked; panel can sit over HUD during play).

| Control | Notes |
| ------- | ----- |
| Structure pick | **C** — select structure bounds for capture |
| Frames | spinbutton, default 120 |
| Ticks / frame | 1–30, default 1 |
| Block padding | 0–32 extra structure margin |
| Countdown | 0–10 s before GIF start |
| Greenscreen | toggle |
| Show mouse | toggle (default on) |
| GIF size limit | dropdown, default **No limit** |
| Record GIF | button + **F8** hotkey |
| Screenshot | **Copy PNG** |

Do not click **Record** or change capture settings unless the user asked (starts capture / countdown).

Quick Save/Load Position and Game. Creatures: Voidgrazer, Lumling, Redweaver, Voltblub, Shinelet.

## Audio

Music rotation transport + playlist. Active sounds monitor. Sound mixer / Sound Board.

## Sim

Scheduling (Columns, 2-phase, Hybrid, Work-Stealing). UPS, tick ms, elements, chunks. Tick breakdown, worker timeline.

## Stats

ID slabs table. Block grid (types / 255, filter palette, tiles, SAB). Locale Stats / Locale Inspector.
