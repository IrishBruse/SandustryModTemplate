import { ui as uiNs } from "./api/ui";
import { player as playerNs } from "./api/player";
import { world as worldNs } from "./api/world";
import { terrains as terrainsNs } from "./api/terrains";
import { structures as structuresNs } from "./api/structures";
import { elements as elementsNs } from "./api/elements";
import { maps as mapsNs } from "./api/maps";
import { effects as effectsNs } from "./api/effects";
import { shared as sharedBuffersNs } from "./api/shared";

/** Shared main/worker API namespaces grouped under `shared.api`. */
export namespace shared {
  export namespace api {
    export import ui = uiNs;
    export import player = playerNs;
    export import world = worldNs;
    export import terrains = terrainsNs;
    export import structures = structuresNs;
    export import elements = elementsNs;
    export import maps = mapsNs;
    export import effects = effectsNs;
    /** Cross-thread shared memory buffers. */
    export import shared = sharedBuffersNs;
  }
}
