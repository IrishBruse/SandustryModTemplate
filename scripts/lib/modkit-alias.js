/**
 * Map public `@modkit/*` import paths to files under `modkit/`.
 * `@modkit/debug` resolves to `modkit/internal/debug`.
 * @param {string} rest Path after `@modkit/` (empty for `@modkit` alone)
 */
export function modkitAliasRest(rest) {
  if (rest === "debug") return "internal/debug";
  return rest;
}

/** @param {string} modkitDir Absolute path to `modkit/` */
export function modkitAliasPlugin(modkitDir) {
  return {
    name: "modkit-alias",
    setup(build) {
      build.onResolve({ filter: /^@modkit(?:\/|$)/ }, (args) => {
        const rest = args.path === "@modkit" ? "" : args.path.slice("@modkit/".length);
        const mapped = modkitAliasRest(rest);
        return build.resolve(mapped === "" ? "." : `./${mapped}`, {
          kind: args.kind,
          importer: args.importer,
          resolveDir: modkitDir,
        });
      });
    },
  };
}
