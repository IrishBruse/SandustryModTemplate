import { AssetRef } from "./asset";

export type CellCoordinates = [cellX: number, cellY: number]


export type Vector2 = {
  x: number;
  y: number;
};

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: Vector2
  threshold: Vector2;
  onGround: boolean;
  speedCapOverdrive: {
    x: {
      dir: null;
      active: boolean;
      bonus: number;
      releaseTime: number;
      releaseBonus: number;
    };
    y: {
      dir: null;
      active: boolean;
      bonus: number;
      releaseTime: number;
      releaseBonus: number;
    };
  };
  inventory: InventoryItem[];
  buildings: number[];
  tech: {
    [key: string | number]: {
      x: number,
      y: number,
      descriptionKey: string;
      descriptionParams?: {
        [key: string]: number;
      };
      cost: number;
      branch: string;
      nameKey?: string;
      icon?: {
        spriteName: string;
      };
      unlocks: {
        structures?: string[];
        items?: string[];
        map?: boolean;
      };
      currencyType?: string;
      isElectricity?: boolean;
      electricityNodeStyle?: boolean;
      requires?: (string | number)[];
      isAlien?: boolean;
      radiusUnlockPx?: number;
      locked?: boolean;
      threshold?: number;
    };
  };
  lockedTechs: { [key: string]: boolean },
  action: null;
  hotbar: {
    activeSlotIndex: number;
    hotbarIndex: number;
    bars: AssetRef[][];
  };
  grapplingHook: boolean;
  cooldowns: {
    boostParticle: {
      time: number;
      last: number;
    };
    hoverParticle: {
      time: number;
      last: number;
    };
    slowdown: {
      last: number;
    };
  };
  isHovering: boolean;
  weaponsMeta: {
    rocketLauncher: {
      ammo: {
        current: number;
        reload: {
          last: number;
        };
        reloading: boolean;
      };
    };
  };
}


export interface InventoryItem {
  id: number,
  itemType: number,
  abilities: {
    type: number,
    levelRequirement?: number,
    attributes: {
      [key: string]: {
        opts?: {
          speed?: number,
          angle?: number
        },
        type: number,
        attributes?: {
          blastRadius?: number
        },
      },
    },
    cooldown: {
      time: number,
      last: number
    }
  }[],
  nameKey: string,
  descriptionKey: string,
  categoryKey: "excavation" | "utility" | "drones",
  sprite?: AssetRef,
}