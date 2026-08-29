const XHTML_NS = "http://www.w3.org/1999/xhtml";

const GENERIC_FONT_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong",
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
]);

const TYPOGRAPHY_PROPS = [
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "font-variant",
  "font-stretch",
  "font-kerning",
  "letter-spacing",
  "word-spacing",
  "line-height",
  "text-transform",
  "text-decoration-line",
  "text-decoration-color",
  "text-decoration-style",
  "text-decoration-thickness",
  "color",
] as const;

function skipComputedProperty(name: string): boolean {
  return (
    name === "animation" ||
    name.startsWith("animation-") ||
    name.startsWith("transition") ||
    name === "content"
  );
}

/** SVG-as-image treats url(...) as a foreign origin and taints the canvas. */
export function cssValueHasUnsafeUrl(value: string): boolean {
  const lower = value.toLowerCase();
  let from = 0;
  while (from < lower.length) {
    const index = lower.indexOf("url(", from);
    if (index < 0) return false;
    const start = index + 4;
    const end = lower.indexOf(")", start);
    if (end < 0) return true;
    const inner = lower.slice(start, end).trim().replaceAll(/['"]/g, "");
    if (inner && !inner.startsWith("data:")) return true;
    from = end + 1;
  }
  return false;
}

function computedStyleCssText(style: CSSStyleDeclaration): string {
  let css = "";
  for (let i = 0; i < style.length; i++) {
    const name = style.item(i);
    if (skipComputedProperty(name)) continue;
    const value = style.getPropertyValue(name);
    if (cssValueHasUnsafeUrl(value)) continue;
    css += `${name}:${value};`;
  }
  return css;
}

function isStyleSheetNode(node: Element): boolean {
  const tag = node.tagName;
  return tag === "STYLE" || tag === "SCRIPT" || tag === "LINK";
}

function isRemovableStyleSheetNode(node: Element): boolean {
  const tag = node.tagName;
  return tag === "SCRIPT" || tag === "LINK";
}

/** Unwrap CSS `content` quoted strings. */
export function cssContentToText(content: string): string | null {
  const value = content.trim();
  if (!value || value === "none" || value === "normal" || value === "open-quote") return null;
  if (value === "close-quote" || value === "no-open-quote" || value === "no-close-quote") {
    return null;
  }
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return null;
}

function counterValueFromList(list: string | undefined, name: string): string | null {
  if (!list || list === "none") return null;
  const match = new RegExp(`(?:^|\\s)${name}\\s+(-?\\d+)`, "i").exec(list);
  return match?.[1] ?? null;
}

/**
 * Resolve CSS `content` to plain text for overlay bake.
 * Handles quoted strings and `counter(name)` via counter-set / counter-reset / `--name`.
 */
export function resolveCssContentText(
  content: string,
  counters: {
    reset?: string;
    set?: string;
    varForName?: (name: string) => string;
  },
): string | null {
  const quoted = cssContentToText(content);
  if (quoted !== null) return quoted;

  const match = /^counter\(\s*([a-zA-Z_][\w-]*)/i.exec(content.trim());
  if (!match) return null;
  const name = match[1]!;
  const fromVar = counters.varForName?.(name)?.trim() ?? "";
  return (
    counterValueFromList(counters.set, name) ??
    counterValueFromList(counters.reset, name) ??
    (/^-?\d+$/.test(fromVar) ? fromVar : null)
  );
}

/** Split a CSS font-family list into unquoted family names. */
export function parseFontFamilyList(fontFamily: string): string[] {
  const out: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  for (const ch of fontFamily) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ",") {
      const name = current.trim();
      if (name) out.push(name);
      current = "";
      continue;
    }
    current += ch;
  }
  const name = current.trim();
  if (name) out.push(name);
  return out;
}

export function isGenericFontFamily(name: string): boolean {
  return GENERIC_FONT_FAMILIES.has(name.trim().toLowerCase());
}

function bakeTypography(style: CSSStyleDeclaration, target: HTMLElement): void {
  for (const prop of TYPOGRAPHY_PROPS) {
    const value = style.getPropertyValue(prop);
    if (!value) continue;
    target.style.setProperty(prop, value);
  }
}

/** Freeze the current animation frame without locking used layout widths. */
function freezeAnimatedStyles(live: Element, clone: HTMLElement): void {
  const style = getComputedStyle(live);
  clone.style.setProperty("animation", "none");
  clone.style.setProperty("transition", "none");
  clone.style.transform = style.transform;
  clone.style.opacity = style.opacity;
  clone.style.filter = style.filter;
  clone.style.translate = style.translate;
  clone.style.rotate = style.rotate;
  clone.style.scale = style.scale;
  clone.style.backgroundPosition = style.backgroundPosition;
  // SVG-as-image cannot see page @font-face; bake used typography and embed fonts separately.
  bakeTypography(style, clone);
}

function insertBakedPseudo(
  live: Element,
  clone: HTMLElement,
  pseudo: "::before" | "::after",
): boolean {
  const style = getComputedStyle(live, pseudo);
  const raw = style.content.trim();
  if (raw === "none" || style.display === "none") return false;

  const liveStyle = getComputedStyle(live);
  const content =
    resolveCssContentText(raw, {
      reset: liveStyle.counterReset,
      set: liveStyle.counterSet,
      varForName: (name) => liveStyle.getPropertyValue(`--${name}`).trim(),
    }) ?? "";

  const node = document.createElement("span");
  node.setAttribute("data-overlay-pseudo", pseudo.slice(2));
  // Pseudos that only paint via `content` need typography, not a full used-box bake
  // (used widths from the live page clip differently inside SVG foreignObject fonts).
  if (content) {
    node.style.cssText = "display:inline;";
    bakeTypography(style, node);
    node.textContent = content;
  } else {
    node.style.cssText = computedStyleCssText(style);
  }
  if (pseudo === "::before") clone.insertBefore(node, clone.firstChild);
  else clone.appendChild(node);
  return true;
}

function bakeElement(live: Element, clone: Element): void {
  if (!(clone instanceof HTMLElement)) return;
  if (isStyleSheetNode(live)) {
    if (isRemovableStyleSheetNode(live)) clone.remove();
    return;
  }

  freezeAnimatedStyles(live, clone);

  const liveKids = [...live.children];
  const cloneKids = [...clone.children];
  const count = Math.min(liveKids.length, cloneKids.length);
  for (let i = 0; i < count; i++) {
    const liveKid = liveKids[i]!;
    const cloneKid = cloneKids[i]!;
    if (isStyleSheetNode(liveKid)) {
      if (isRemovableStyleSheetNode(liveKid)) cloneKid.remove();
      continue;
    }
    bakeElement(liveKid, cloneKid);
  }

  const bakedBefore = insertBakedPseudo(live, clone, "::before");
  const bakedAfter = insertBakedPseudo(live, clone, "::after");
  if (bakedBefore || bakedAfter) clone.setAttribute("data-baked-pseudos", "");
}

/**
 * Escape rawtext so HTML `outerHTML` style/script contents stay valid inside SVG XML.
 * Needed for CSS like `@property { syntax: "<integer>"; }`.
 */
export function escapeXmlText(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function collectFontFamiliesFromTree(root: Element): Set<string> {
  const families = new Set<string>();
  const visit = (el: Element, pseudo?: "::before" | "::after") => {
    const style = pseudo ? getComputedStyle(el, pseudo) : getComputedStyle(el);
    for (const name of parseFontFamilyList(style.fontFamily)) {
      if (!isGenericFontFamily(name)) families.add(name);
    }
    if (!pseudo) {
      const before = getComputedStyle(el, "::before").content.trim();
      const after = getComputedStyle(el, "::after").content.trim();
      if (before !== "none") visit(el, "::before");
      if (after !== "none") visit(el, "::after");
      for (const kid of el.children) {
        if (!isStyleSheetNode(kid)) visit(kid);
      }
    }
  };
  visit(root);
  return families;
}

function cssUrlFromSrcPart(part: string): string | null {
  const match = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/i.exec(part);
  if (!match) return null;
  return match[2] ?? null;
}

async function urlToDataUri(url: string): Promise<string | null> {
  if (url.startsWith("data:")) return url;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const mime =
      response.headers.get("content-type")?.split(";")[0]?.trim() ||
      (url.endsWith(".woff2")
        ? "font/woff2"
        : url.endsWith(".woff")
          ? "font/woff"
          : url.endsWith(".otf")
            ? "font/otf"
            : "font/ttf");
    return `data:${mime};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

async function inlineFontFaceSrc(src: string): Promise<string | null> {
  const parts = src.split(",");
  const out: string[] = [];
  for (const part of parts) {
    const url = cssUrlFromSrcPart(part);
    if (!url) continue;
    const dataUri = await urlToDataUri(url);
    if (!dataUri) continue;
    const format = /format\(\s*(['"]?)([^)'"]+)\1\s*\)/i.exec(part)?.[2];
    out.push(
      format
        ? `url(${JSON.stringify(dataUri)}) format(${JSON.stringify(format)})`
        : `url(${JSON.stringify(dataUri)})`,
    );
  }
  return out.length > 0 ? out.join(",") : null;
}

function quoteCssFamily(name: string): string {
  if (/^[a-zA-Z][\w-]*$/.test(name)) return name;
  return JSON.stringify(name);
}

/**
 * Build @font-face CSS with data-URI sources for families used by the live overlay.
 * SVG-as-image cannot load the page's file:// / http fonts.
 */
export async function buildEmbeddedFontFaceCss(families: Iterable<string>): Promise<string> {
  const wanted = new Set(
    [...families]
      .map((name) => name.trim().toLowerCase())
      .filter((name) => name && !isGenericFontFamily(name)),
  );
  if (wanted.size === 0) return "";

  const chunks: string[] = [];
  const seen = new Set<string>();
  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of rules) {
      if (!(rule instanceof CSSFontFaceRule)) continue;
      const familyRaw = rule.style.getPropertyValue("font-family");
      const familyNames = parseFontFamilyList(familyRaw);
      if (!familyNames.some((name) => wanted.has(name.toLowerCase()))) continue;
      const src = rule.style.getPropertyValue("src");
      if (!src) continue;
      const inlined = await inlineFontFaceSrc(src);
      if (!inlined) continue;
      const weight = rule.style.getPropertyValue("font-weight") || "normal";
      const style = rule.style.getPropertyValue("font-style") || "normal";
      const family = familyNames[0] ?? familyRaw;
      const key = `${family.toLowerCase()}|${weight}|${style}|${inlined.slice(0, 64)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      chunks.push(
        `@font-face{font-family:${quoteCssFamily(family)};font-weight:${weight};font-style:${style};src:${inlined}}`,
      );
    }
  }
  return chunks.join("\n");
}

/** Clone a live overlay root with current computed styles (including CSS animations). */
export async function snapshotOverlayRootHtml(root: HTMLElement): Promise<string | null> {
  await document.fonts.ready;
  const families = collectFontFamiliesFromTree(root);
  const fontCss = await buildEmbeddedFontFaceCss(families);

  const clone = root.cloneNode(true);
  if (!(clone instanceof HTMLElement)) return null;
  bakeElement(root, clone);

  if (fontCss) {
    const fontStyle = document.createElement("style");
    fontStyle.textContent = fontCss;
    clone.insertBefore(fontStyle, clone.firstChild);
  }

  const disablePseudos = document.createElement("style");
  disablePseudos.textContent =
    "[data-baked-pseudos]::before,[data-baked-pseudos]::after{content:none!important;display:none!important}";
  clone.insertBefore(disablePseudos, clone.firstChild);

  clone.setAttribute("xmlns", XHTML_NS);
  for (const node of clone.querySelectorAll("img,video,iframe,object,embed,image,use")) {
    node.remove();
  }
  // XMLSerializer escapes `<` in style text once for SVG foreignObject.
  return new XMLSerializer().serializeToString(clone);
}
