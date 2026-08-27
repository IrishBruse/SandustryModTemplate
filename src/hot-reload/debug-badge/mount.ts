/** DOM id for the always-on debug marker. */
export const DEBUG_BADGE_ELEMENT_ID = "hot-reload-debug-badge";

const BADGE_STYLE: Partial<CSSStyleDeclaration> = {
  position: "fixed",
  top: "0",
  left: "0",
  margin: "0",
  padding: "3px 5px",
  color: "#ff3333",
  fontFamily: '"Consolas", "Liberation Mono", "Courier New", monospace',
  fontSize: "11px",
  lineHeight: "1",
  letterSpacing: "0.06em",
  textTransform: "lowercase",
  userSelect: "none",
  pointerEvents: "none",
  zIndex: "2147483647",
  textShadow: "0 0 2px rgba(0, 0, 0, 0.9)",
};

function createBadgeElement(id: string): HTMLSpanElement {
  const el = document.createElement("span");
  el.id = id;
  el.setAttribute("aria-hidden", "true");
  el.textContent = "debug";
  Object.assign(el.style, BADGE_STYLE);
  return el;
}

/** Mount the debug badge on `document.body`. Idempotent. */
export function mountDebugBadge(id = DEBUG_BADGE_ELEMENT_ID): () => void {
  function attach(): void {
    if (document.getElementById(id)) return;
    document.body.appendChild(createBadgeElement(id));
  }

  if (document.body) attach();
  else document.addEventListener("DOMContentLoaded", attach, { once: true });

  return () => {
    document.getElementById(id)?.remove();
  };
}

/**
 * Early bundle patch — mounts the badge before mods and React UI run (splash included).
 * Re-test the find string after each game update.
 */
export function earlyDebugBadgePatchIife(): string {
  const badgeId = DEBUG_BADGE_ELEMENT_ID;
  return `(function(){try{var id=${JSON.stringify(badgeId)};function go(){if(document.getElementById(id))return;var el=document.createElement("span");el.id=id;el.setAttribute("aria-hidden","true");el.textContent="debug";Object.assign(el.style,{position:"fixed",top:"0",left:"0",margin:"0",padding:"3px 5px",color:"#ff3333",fontFamily:'Consolas,"Liberation Mono","Courier New",monospace',fontSize:"11px",lineHeight:"1",letterSpacing:"0.06em",textTransform:"lowercase",userSelect:"none",pointerEvents:"none",zIndex:"2147483647",textShadow:"0 0 2px rgba(0,0,0,0.9)"});document.body.appendChild(el)}if(document.body)go();else document.addEventListener("DOMContentLoaded",go,{once:true})}catch(e){}})();`;
}
