/**
 * npm CLI file name for spawn / spawnSync without shell.
 * Windows cannot run `npm` as a process (it is npm.cmd).
 * @param {NodeJS.Platform} [platform]
 */
export function npmCli(platform = process.platform) {
  return platform === "win32" ? "npm.cmd" : "npm";
}
