/** `globalThis.__hrMark` / `__hrBoot` — boot timestamps for MCP. */
export function bootMarkHelperIife(): string {
  return `(function(){try{var g=globalThis;if(!g.__hrBoot)g.__hrBoot={o:performance.now(),marks:[]};g.__hrMark=function(n){g.__hrBoot.marks.push({n:String(n),t:Math.round(performance.now()-g.__hrBoot.o)})};g.__hrMark("bundle")}catch(e){}})();`;
}

export function markCall(name: string): string {
  return `(globalThis.__hrMark||function(){})(${JSON.stringify(name)})`;
}
