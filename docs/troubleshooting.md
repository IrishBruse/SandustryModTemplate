# Troubleshooting

**Mods do not load** — Opt into the Steam beta: Library → Sandustry → Properties → Betas → select `mods`.

![Steam Properties Betas tab with the mods branch selected](assets/images/mods-branch.png)

**Game binary not found** — Point the launcher at your executable:

```bash
export SANDUSTRY=/path/to/sandustry
```

Default path: `~/games/SteamLibrary/steamapps/common/Sandustry/sandustry`.

**Types missing** — Run `git submodule update --init --recursive`. Types live in `types/` ([sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types)).
