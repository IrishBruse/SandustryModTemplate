import assert from "node:assert/strict";
import test from "node:test";
import {
  apiPathToQualifiedName,
  apiPathToRouteFile,
  collectSearchPaths,
  mdFileToSearchPath,
  qualifyApiMarkdown,
  qualifiedNameToSlug,
  rewriteApiHrefMap,
} from "./api-search.mjs";

test("apiPathToQualifiedName maps TypeDoc files to runtime names", () => {
  assert.equal(apiPathToQualifiedName("README.md"), "Sandkit API types");
  assert.equal(apiPathToQualifiedName("types.md"), "Sandkit API types");
  assert.equal(apiPathToQualifiedName("modules.md"), "Sandkit API");
  assert.equal(
    apiPathToQualifiedName("sandkit/api/namespaces/settings/README.md"),
    "sandkit.api.settings",
  );
  assert.equal(
    apiPathToQualifiedName("sandkit/api/namespaces/ui/namespaces/overlays/README.md"),
    "sandkit.api.ui.overlays",
  );
  assert.equal(
    apiPathToQualifiedName("worker/namespaces/elements/README.md"),
    "sandkit.api.elements (worker)",
  );
  assert.equal(
    apiPathToQualifiedName("worker/namespaces/structures/namespaces/processing/README.md"),
    "sandkit.api.structures.processing (worker)",
  );
  assert.equal(apiPathToQualifiedName("engine/README.md"), "sandkit.engine");
  assert.equal(
    apiPathToQualifiedName("engine/namespaces/game/README.md"),
    "sandkit.engine.api.game",
  );
  assert.equal(
    apiPathToQualifiedName("sandkit/enums/enumerations/Scene.md"),
    "sandkit.enums.Scene",
  );
  assert.equal(apiPathToQualifiedName("sandkit/react/README.md"), "sandkit.react");
  assert.equal(apiPathToQualifiedName("shared/player/README.md"), "shared.player");
  assert.equal(apiPathToQualifiedName("sandkit.api.settings.md"), "sandkit.api.settings");
  assert.equal(
    apiPathToQualifiedName("sandkit.api.elements.worker.md"),
    "sandkit.api.elements (worker)",
  );
  assert.equal(apiPathToQualifiedName("global/README.md"), null);
  assert.equal(apiPathToQualifiedName("api/_sidebar.md"), null);
});

test("qualifiedNameToSlug and apiPathToRouteFile use runtime-style URLs", () => {
  assert.equal(qualifiedNameToSlug("sandkit.api.action"), "sandkit.api.action");
  assert.equal(qualifiedNameToSlug("sandkit.api.elements (worker)"), "sandkit.api.elements.worker");
  assert.equal(qualifiedNameToSlug("Sandkit API types"), "types");
  assert.equal(
    apiPathToRouteFile("sandkit/api/namespaces/action/README.md"),
    "sandkit.api.action.md",
  );
  assert.equal(
    apiPathToRouteFile("worker/namespaces/elements/README.md"),
    "sandkit.api.elements.worker.md",
  );
  assert.equal(
    apiPathToRouteFile("engine/namespaces/game/README.md"),
    "sandkit.engine.api.game.md",
  );
});

test("qualifyApiMarkdown sets search titles and keeps short heading ids", () => {
  const src = `# settings

## Functions

### get()

Return a value.

## Type Aliases

### ConfigValueV1

A value.
`;
  const out = qualifyApiMarkdown(src, "sandkit.api.settings");
  assert.match(out, /^# sandkit\.api\.settings$/m);
  assert.match(out, /^## Functions <!-- \{docsify-ignore\} -->$/m);
  assert.match(out, /^### sandkit\.api\.settings\.get\(\) :id=get$/m);
  assert.match(out, /^### sandkit\.api\.settings\.ConfigValueV1 :id=configvaluev1$/m);
});

test("qualifyApiMarkdown marks worker members without breaking the main-thread name", () => {
  const src = `# elements

## Functions

### register()
`;
  const out = qualifyApiMarkdown(src, "sandkit.api.elements (worker)");
  assert.match(out, /^# sandkit\.api\.elements \(worker\)$/m);
  assert.match(out, /^### sandkit\.api\.elements\.register\(\) \(worker\) :id=register$/m);
});

test("mdFileToSearchPath matches Docsify getFile paths", () => {
  assert.equal(mdFileToSearchPath("README.md"), "/");
  assert.equal(mdFileToSearchPath("quick-start.md"), "/quick-start");
  assert.equal(mdFileToSearchPath("api/sandkit.api.settings.md"), "/api/sandkit.api.settings");
  assert.equal(mdFileToSearchPath("api/_sidebar.md"), null);
  assert.equal(mdFileToSearchPath("api/global/README.md"), null);
  assert.equal(mdFileToSearchPath("AGENTS.md"), null);
});

test("rewriteApiHrefMap remaps TypeDoc links to flat slugs", () => {
  const map = new Map([
    ["api/sandkit/api/namespaces/ui/README.md", "api/sandkit.api.ui.md"],
    ["api/shared/asset/README.md", "api/shared.asset.md"],
  ]);
  const out = rewriteApiHrefMap(
    "See [ui](api/sandkit/api/namespaces/ui/README.md) and [AssetRef](api/shared/asset/README.md#assetref).",
    map,
  );
  assert.equal(
    out,
    "See [ui](api/sandkit.api.ui.md) and [AssetRef](api/shared.asset.md#assetref).",
  );
});

test("collectSearchPaths sorts and drops skip files", () => {
  assert.deepEqual(collectSearchPaths(["AGENTS.md", "README.md", "builds.md"]), ["/", "/builds"]);
});
