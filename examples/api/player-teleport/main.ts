import { modinfo } from "./modinfo";

const api = sandkit.api;

const BINDING_TELEPORT = `${modinfo.id}.teleport`;

type EngineState = {
  shared?: {
    mouse?: {
      worldPosition?: [number, number];
    };
  };
};

api.input.registerBinding(BINDING_TELEPORT, ["KeyZ"], {
  displayName: "Teleport to cursor",
  category: modinfo.name,
  handlers: {
    down: () => {
      if (api.input.isCtrlHeld()) return;

      const state = sandkit.engine.state as EngineState | undefined;
      const pos = state?.shared?.mouse?.worldPosition;
      if (!pos) return;

      api.player.setPositionAtWorld(pos[0], pos[1]);
    },
  },
});

const teleportKey = api.input.getDisplayKey(BINDING_TELEPORT, "Z");

api.ui.toast(`Player Teleport — press ${teleportKey} at the cursor`, {});

console.log(`loaded — player.setPositionAtWorld on ${BINDING_TELEPORT} (${teleportKey})`);
