/**
 * Shared player and coordinate domain shapes.
 *
 * @internal Base types reused by main and worker API declarations. Not a
 * runtime `sandkit` namespace.
 */
import { AssetRef } from "./asset";

/**
 * Grid cell position as `[cellX, cellY]`.
 *
 * Cell coordinates match `sandkit.api.*AtCell` helpers: column first, then row.
 */
export type CellCoordinates = [cellX: number, cellY: number]

/**
 * 2D vector in world or cell space.
 *
 * World positions use pixels. Cell helpers may return pixel or cell units
 * depending on the API.
 */
export type Vector2 = {
  /** Horizontal component. */
  x: number;
  /** Vertical component. */
  y: number;
};

/**
 * Live player state snapshot (read-only shape for mods).
 *
 * Reflects `sandkit.engine.state` / store player fields exposed to mods.
 */
export interface Player {
  /** Player hitbox left edge in world pixels. */
  x: number;
  /** Player hitbox top edge in world pixels. */
  y: number;
  /** Player hitbox width in world pixels. */
  width: number;
  /** Player hitbox height in world pixels. */
  height: number;
  /** Current movement velocity in pixels per second. */
  velocity: Vector2
  /** Movement threshold accumulator used by physics. */
  threshold: Vector2;
  /**
   * Spawn flag. Live physics does not update this field.
   * Use `sandkit.api.player.isOnGround()` (solid cells 1px below the hitbox).
   */
  onGround: boolean;
  /** Temporary speed-cap bonuses applied on each axis. */
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
  /** Items currently held in the player inventory. */
  inventory: InventoryItem[];
  /** Structure type ids the player has unlocked for building. */
  buildings: number[];
  /** Tech tree nodes and their unlock metadata. */
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
  /** Tech ids explicitly locked for this save. */
  lockedTechs: { [key: string]: boolean },
  /** Active world action, or null when idle. */
  action: null;
  /** Hotbar slots, active indices, and item sprites. */
  hotbar: {
    activeSlotIndex: number;
    hotbarIndex: number;
    bars: AssetRef[][];
  };
  /** True when the grappling hook is equipped or active. */
  grapplingHook: boolean;
  /** Cooldown timestamps for movement particles and slowdown. */
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
  /** True when hover movement mode is active. */
  isHovering: boolean;
  /** Per-weapon runtime metadata. */
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

/** One hotbar or inventory item entry. */
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
