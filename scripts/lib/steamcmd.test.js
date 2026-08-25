import assert from "node:assert/strict";
import { posix, win32 } from "node:path";
import test from "node:test";
import { npmCli } from "./npm-cli.js";
import {
  officialSteamCmdArchive,
  steamCmdBinaryNames,
  steamCmdCacheDir,
  steamCmdHomeDir,
  steamCmdNeedsCachedLogin,
  steamCmdProcessEnv,
  steamCmdStatusLines,
  windowsHomeDriveAndPath,
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

test("workshopUploadSucceeded accepts update output without the word workshop", () => {
  // Real SteamCMD update log: no "Create new workshop item", no "workshop" string.
  const out = `
Loading Steam API...OK
Logging in using cached credentials.
Logging in user 'irishbruse' [U:1:314183318] to Steam Public...OK
Waiting for client config...OK
Waiting for user info...Waiting for compat in post-logon took: 0.098174sOK

Preparing content...
Uploading content...
Uploading preview image...
Committing update...IPC function call IClientUtils::GetAPICallResult took too long: 55 msec
Success.Unloading Steam API...OK
`;
  assert.equal(workshopUploadSucceeded(out), true);

  const seen = new Set();
  const lines = [];
  for (const chunk of out.split(/(?<=\n)/)) {
    lines.push(...steamCmdStatusLines(chunk, seen));
  }
  assert.ok(lines.includes("Workshop upload OK"));
});

test("workshopUploadSucceeded accepts CRLF SteamCMD output", () => {
  const out =
    "Preparing content...\r\nUploading content...\r\nCommitting update...\r\nSuccess.\r\n";
  assert.equal(workshopUploadSucceeded(out), true);
});

test("workshopUploadSucceeded rejects login chatter and bare Success", () => {
  assert.equal(
    workshopUploadSucceeded(
      "Logging in using cached credentials.\nWaiting for user info...OK\nUnloading Steam API...OK\n",
    ),
    false,
  );
  assert.equal(workshopUploadSucceeded("Success.\n"), false);
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

test("steamCmdCacheDir uses LOCALAPPDATA on Windows and ~/.cache on Unix", () => {
  assert.equal(
    steamCmdCacheDir({
      platform: "win32",
      env: { LOCALAPPDATA: "D:\\AppData\\Local" },
      home: "C:\\Users\\me",
    }),
    win32.join("D:\\AppData\\Local", "sandustry-steamcmd"),
  );
  assert.equal(
    steamCmdCacheDir({
      platform: "win32",
      env: {},
      home: "C:\\Users\\me",
    }),
    win32.join("C:\\Users\\me", "AppData", "Local", "sandustry-steamcmd"),
  );
  assert.equal(
    steamCmdCacheDir({ platform: "linux", env: {}, home: "/home/me" }),
    posix.join("/home/me", ".cache", "sandustry-steamcmd"),
  );
  assert.equal(
    steamCmdHomeDir({
      platform: "win32",
      env: { LOCALAPPDATA: "D:\\AppData\\Local" },
      home: "C:\\Users\\me",
    }),
    win32.join("D:\\AppData\\Local", "sandustry-steamcmd", "home"),
  );
});

test("windowsHomeDriveAndPath splits drive and path", () => {
  assert.deepEqual(windowsHomeDriveAndPath("D:\\AppData\\Local\\sandustry-steamcmd\\home"), {
    HOMEDRIVE: "D:",
    HOMEPATH: "\\AppData\\Local\\sandustry-steamcmd\\home",
  });
  assert.deepEqual(windowsHomeDriveAndPath("C:/Users/me"), {
    HOMEDRIVE: "C:",
    HOMEPATH: "\\Users\\me",
  });
});

test("steamCmdProcessEnv isolates Windows USERPROFILE and AppData", () => {
  const env = steamCmdProcessEnv({
    platform: "win32",
    env: {
      PATH: "C:\\Windows",
      USERPROFILE: "C:\\Users\\me",
      LOCALAPPDATA: "C:\\Users\\me\\AppData\\Local",
      APPDATA: "C:\\Users\\me\\AppData\\Roaming",
      HOMEDRIVE: "C:",
      HOMEPATH: "\\Users\\me",
    },
    home: "C:\\Users\\me",
  });
  const steamHome = win32.join("C:\\Users\\me", "AppData", "Local", "sandustry-steamcmd", "home");
  assert.equal(env.USERPROFILE, steamHome);
  assert.equal(env.HOME, steamHome);
  assert.equal(env.HOMEDRIVE, "C:");
  assert.equal(env.HOMEPATH, "\\Users\\me\\AppData\\Local\\sandustry-steamcmd\\home");
  assert.equal(env.LOCALAPPDATA, win32.join(steamHome, "AppData", "Local"));
  assert.equal(env.APPDATA, win32.join(steamHome, "AppData", "Roaming"));
  assert.equal(env.PATH, "C:\\Windows");
});

test("steamCmdProcessEnv only overrides HOME on Unix", () => {
  const env = steamCmdProcessEnv({
    platform: "linux",
    env: { PATH: "/usr/bin", HOME: "/home/me", USERPROFILE: "keep" },
    home: "/home/me",
  });
  assert.equal(env.HOME, posix.join("/home/me", ".cache", "sandustry-steamcmd", "home"));
  assert.equal(env.USERPROFILE, "keep");
  assert.equal(env.PATH, "/usr/bin");
  assert.equal(env.LOCALAPPDATA, undefined);
});

test("officialSteamCmdArchive and binary names match the platform", () => {
  assert.equal(officialSteamCmdArchive("win32")?.archiveName, "steamcmd.zip");
  assert.equal(officialSteamCmdArchive("linux")?.archiveName, "steamcmd_linux.tar.gz");
  assert.equal(officialSteamCmdArchive("darwin")?.archiveName, "steamcmd_osx.tar.gz");
  assert.equal(officialSteamCmdArchive("aix"), null);
  assert.deepEqual(steamCmdBinaryNames("win32"), [
    "steamcmd.exe",
    win32.join("steamcmd", "steamcmd.exe"),
  ]);
  assert.deepEqual(steamCmdBinaryNames("linux"), [
    "steamcmd.sh",
    posix.join("steamcmd", "steamcmd.sh"),
    posix.join("steamcmd", "linux64", "steamcmd"),
  ]);
});

test("npmCli uses npm.cmd on Windows", () => {
  assert.equal(npmCli("win32"), "npm.cmd");
  assert.equal(npmCli("linux"), "npm");
  assert.equal(npmCli("darwin"), "npm");
});
