import assert from "node:assert/strict";
import test from "node:test";
import {
  steamCmdNeedsCachedLogin,
  steamCmdStatusLines,
  workshopUploadSucceeded,
} from "./steamcmd.js";

test("steamCmdStatusLines maps upload chatter to short status", () => {
  const seen = new Set();
  const sample = `
Loading Steam API...OK
Logging in using cached credentials.
Logging in user 'irishbruse' [U:1:314183318] to Steam Public...OK
Waiting for client config...OK
Waiting for user info...OK
Create new workshop item ( PublishFileID 3789565734).
Preparing update...
Preparing content...
Uploading content...
Uploading preview image...
Committing update...
Success.
Unloading Steam API...OK
`;
  const lines = [];
  for (const chunk of sample.split("\n")) {
    lines.push(...steamCmdStatusLines(chunk + "\n", seen));
  }
  assert.deepEqual(lines, [
    "Steam login (cached)…",
    "Steam login OK",
    "Creating Workshop item 3789565734…",
    "Preparing update…",
    "Preparing content…",
    "Uploading content…",
    "Uploading preview…",
    "Committing update…",
    "Workshop upload OK",
  ]);
  assert.equal(workshopUploadSucceeded(sample), true);
});

test("steamCmdNeedsCachedLogin detects failed password-less login", () => {
  const out = `
"@NoPromptForPassword" = "1"
Cached credentials not found.
FAILED (No cached credentials and @NoPromptForPassword is set)
`;
  assert.equal(steamCmdNeedsCachedLogin(out), true);
  const seen = new Set();
  assert.deepEqual(steamCmdStatusLines(out, seen), ["SteamCMD has no cached credentials"]);
});
