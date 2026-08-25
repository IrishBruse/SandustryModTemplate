# Pause

**Menu [Esc]** or **Escape**. Dimmer `z-[10010]`. HUD stays behind.

Rows are `w-64 cursor-pointer` (not buttons), except **Mods**.

| Label         | Opens                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Unstuck       | Teleport                                                                                        |
| Send feedback | [feedback.md](feedback.md) (also F2)                                                            |
| Continue      | Close pause                                                                                     |
| Save          | [save-load.md](save-load.md)                                                                    |
| Load          | [save-load.md](save-load.md)                                                                    |
| Options       | [options.md](options.md)                                                                        |
| Mods          | Vanilla `ComponentId.ModsScreen`. This session: template **Mod Inspector** ("Blank for now...") |
| Exit          | Leave run                                                                                       |

Underscores: **C**ontinue, **S**ave, **L**oad, **O**ptions, **E**xit.

Footer: Discord `https://discord.gg/HJNk5eMnmt`, **Early Access 0.5.2 | seed:**, **Copy info for bug report**.

API: `sandkit.api.ui.openPauseMenu()`.
