/**
 * Map public `@modkit/*` import paths to files under `modkit/`.
 * @param {string} rest Path after `@modkit/` (empty for `@modkit` alone)
 */
export function modkitAliasRest(rest) {
  return rest;
}

/** @param {string} modkitDir Absolute path to `modkit/` */
export function modkitAliasPlugin(modkitDir) {
  return {
    name: "modkit-alias",
    setup(build) {
      build.onResolve({ filter: /^@modkit(?:\/|$)/ }, (args) => {
        const rest = args.path === "@modkit" ? "" : args.path.slice("@modkit/".length);
        if (rest === "test" || rest.startsWith("test/")) {
          return {
            errors: [
              {
                text: "@modkit/test is for Node tests only. Do not import it from a mod bundle.",
              },
            ],
          };
        }
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
