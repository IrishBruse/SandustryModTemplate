declare module "*.json" {
  import type { ModInfo } from "@sandustry-modding/types/configs";

  const value: ModInfo & { $schema?: string };
  export default value;
}
