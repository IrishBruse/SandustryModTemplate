export namespace projectiles {
  export function register(definition: any): void;
  export function getDefinitionById(projectileId: string): any;
  export function createBlueprintFromId(projectileId: string): ProjectileBlueprint;
  export function getAll(): Projectile[];
  export function getById(projectileId: number): Projectile | undefined;
  export function remove(projectile: Projectile): void;
  export function spawnAtWorld(worldX: number, worldY: number, angle: number, blueprint: ProjectileBlueprint): Projectile;

  export type ProjectileBlueprint = unknown
  export type Projectile = unknown
}