/**
 * Vanilla `api.assets.getUrl` and custom-map blueprint loads join `rootUrl` + a
 * relative path. The join throws unless both URLs use the `file:` protocol
 * (`workshop-mods.js` sets `pathToFileURL(folder + sep)`).
 *
 * The Chromium test host serves HTTP, so the served `bundle.js` must allow
 * `http:` / `https:` when the resolved href stays under `rootUrl`.
 */

const FILE_ONLY_JOIN =
  /"file:"!==(\w+)\.protocol\|\|"file:"!==(\w+)\.protocol\|\|!\2\.href\.startsWith\(\1\.href\)\|\|\2\.href===\1\.href/;

export function rewriteAssetJoinForHttp(bundle: string): string {
  const next = bundle.replace(
    FILE_ONLY_JOIN,
    '!("file:"===$1.protocol||"http:"===$1.protocol||"https:"===$1.protocol)||$1.protocol!==$2.protocol||!$2.href.startsWith($1.href)||$2.href===$1.href',
  );
  if (next === bundle) {
    throw new Error(
      "bundle.js asset join still requires file: only. The game bundle may have changed.",
    );
  }
  return next;
}
