declare module "react-dom" {
  import type { ReactNode } from "react";

  export function createPortal(node: ReactNode, container: Element | DocumentFragment): ReactNode;
}
