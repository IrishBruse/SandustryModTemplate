/**
 * Dedicated SteamCMD install + quiet Workshop upload helpers.
 * Prefer ~/.cache/sandustry-steamcmd/ so credentials do not share the desktop Steam tree.
 */
import { spawn, spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export const STEAMCMD_DOCS = "https://developer.valvesoftware.com/wiki/SteamCMD";

const IS_WIN = process.platform === "win32";

/** Stable install + credential cache (not the desktop Steam client tree). */
export function steamCmdCacheDir() {
  return join(homedir(), ".cache", "sandustry-steamcmd");
}

/** Fake HOME so SteamCMD does not write sentry files into the desktop Steam tree. */
export function steamCmdHomeDir() {
  return join(steamCmdCacheDir(), "home");
}

/**
 * @returns {NodeJS.ProcessEnv}
 */
function steamCmdEnv() {
  mkdirSync(steamCmdHomeDir(), { recursive: true });
  return { ...process.env, HOME: steamCmdHomeDir() };
}

/**
 * @param {string} repoRoot
 * @returns {string}
 */
export function steamCmdLegacyTmpDir(repoRoot) {
  return join(repoRoot, ".tmp", "steamcmd");
}

/**
 * @param {string} repoRoot
 * @returns {string}
 */
export function steamCmdPublishLogPath(repoRoot) {
  return join(repoRoot, ".tmp", "steamcmd-publish.log");
}

/**
 * @returns {{ url: string, archiveName: string } | null}
 */
export function officialSteamCmdArchive() {
  if (IS_WIN) {
    return {
      url: "https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip",
      archiveName: "steamcmd.zip",
    };
  }
  if (process.platform === "darwin") {
    return {
      url: "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz",
      archiveName: "steamcmd_osx.tar.gz",
    };
  }
  if (process.platform === "linux") {
    return {
      url: "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz",
      archiveName: "steamcmd_linux.tar.gz",
    };
  }
  return null;
}

/**
 * Binary names relative to an install root.
 * @returns {string[]}
 */
function steamCmdBinaryNames() {
  if (IS_WIN) return ["steamcmd.exe", join("steamcmd", "steamcmd.exe")];
  return ["steamcmd.sh", join("steamcmd", "steamcmd.sh"), join("steamcmd", "linux64", "steamcmd")];
}

/**
 * @param {string} root
 * @returns {string | null}
 */
export function findSteamCmdInDir(root) {
  if (!root || !existsSync(root)) return null;
  for (const name of steamCmdBinaryNames()) {
    const candidate = join(root, name);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Prefer dedicated cache, then repo .tmp. Do not use PATH / desktop Steam steamcmd
 * (Debian wrapper shares ~/.local/share/Steam and clears the credential cache).
 * @param {string} repoRoot
 * @returns {string | null}
 */
export function findDedicatedSteamCmd(repoRoot) {
  return (
    findSteamCmdInDir(steamCmdCacheDir()) ??
    findSteamCmdInDir(steamCmdLegacyTmpDir(repoRoot)) ??
    findSteamCmdInDir(join(homedir(), "steamcmd"))
  );
}

/**
 * @param {string} dir
 * @param {string} archive
 */
function extractSteamCmdArchive(dir, archive) {
  const args = archive.endsWith(".zip")
    ? ["-xf", archive, "-C", dir]
    : ["-xzf", archive, "-C", dir];
  const unpacked = spawnSync("tar", args, { stdio: "pipe" });
  if (unpacked.status !== 0) {
    const err = unpacked.stderr ? String(unpacked.stderr) : "";
    throw new Error(
      `Failed to unpack SteamCMD archive with tar (exit ${unpacked.status ?? "?"}).${err ? `\n${err}` : ""}`,
    );
  }
}

/**
 * SteamCMD exit 7 means it self-updated. That is success for a first run.
 * @param {string} bin
 * @param {{ quiet?: boolean }} [options]
 */
export function bootstrapSteamCmd(bin, { quiet = true } = {}) {
  const result = spawnSync(bin, ["+quit"], {
    cwd: dirname(bin),
    env: steamCmdEnv(),
    stdio: quiet ? "pipe" : "inherit",
    timeout: 180_000,
  });
  if (result.status !== 0 && result.status !== 7) {
    throw new Error(
      `SteamCMD bootstrap failed (exit ${result.status ?? "?"}). See ${STEAMCMD_DOCS}`,
    );
  }
}

/**
 * Ensure a dedicated SteamCMD binary exists under ~/.cache/sandustry-steamcmd/.
 * @param {string} repoRoot
 * @param {{ log?: (msg: string) => void }} [options]
 * @returns {Promise<string>}
 */
export async function ensureDedicatedSteamCmd(repoRoot, { log = console.log } = {}) {
  const existing = findDedicatedSteamCmd(repoRoot);
  if (existing) {
    if (!IS_WIN && existing.endsWith(".sh")) chmodSync(existing, 0o755);
    return existing;
  }

  const installDir = steamCmdCacheDir();
  const archiveInfo = officialSteamCmdArchive();
  if (!archiveInfo) {
    throw new Error(`No official SteamCMD archive for ${process.platform}. See ${STEAMCMD_DOCS}`);
  }

  log(`Downloading SteamCMD into ${installDir}/ …`);
  mkdirSync(installDir, { recursive: true });
  const archive = join(installDir, archiveInfo.archiveName);
  const res = await fetch(archiveInfo.url);
  if (!res.ok) {
    throw new Error(
      `SteamCMD download failed: ${res.status} ${res.statusText} (${archiveInfo.url})`,
    );
  }
  writeFileSync(archive, Buffer.from(await res.arrayBuffer()));
  extractSteamCmdArchive(installDir, archive);
  unlinkSync(archive);

  const bin = findSteamCmdInDir(installDir);
  if (!bin) {
    throw new Error(`SteamCMD download finished, but the binary is missing. See ${STEAMCMD_DOCS}`);
  }
  if (!IS_WIN && bin.endsWith(".sh")) chmodSync(bin, 0o755);
  log("Updating SteamCMD (first run)…");
  bootstrapSteamCmd(bin);
  return bin;
}

/** True when workshop_build_item finished (not the earlier login "Success."). */
export function workshopUploadFinished(out) {
  return /workshop/i.test(out) && /success\./i.test(out);
}

export function workshopUploadSucceeded(out) {
  return workshopUploadFinished(out) && !/ERROR!/i.test(out);
}

export function steamCmdNeedsCachedLogin(out) {
  return (
    /No cached credentials/i.test(out) ||
    /Cached credentials not found/i.test(out) ||
    /FAILED \(No cached credentials/i.test(out) ||
    (/@NoPromptForPassword is set/i.test(out) && /FAILED/i.test(out))
  );
}

export function steamCmdLoginSucceeded(out) {
  return (
    /Logging in using cached credentials/i.test(out) ||
    (/Logging in user/i.test(out) && /\bOK\b/.test(out)) ||
    (/Waiting for user info/i.test(out) && /\bOK\b/.test(out))
  );
}

/**
 * Map SteamCMD chatter to short status lines (order preserved, duplicates skipped).
 * @param {string} chunk
 * @param {Set<string>} seen
 * @returns {string[]}
 */
export function steamCmdStatusLines(chunk, seen = new Set()) {
  /** @type {string[]} */
  const lines = [];
  const add = (key, text) => {
    if (seen.has(key)) return;
    seen.add(key);
    lines.push(text);
  };

  if (/Logging in using cached credentials/i.test(chunk)) {
    add("login-cached", "Steam login (cached)…");
  } else if (/Proceeding with login using username\/password/i.test(chunk)) {
    add("login-password", "Steam login…");
  } else if (
    /Logging in user/i.test(chunk) &&
    !seen.has("login-cached") &&
    !seen.has("login-password")
  ) {
    add("login-start", "Steam login…");
  }

  if (
    /Waiting for user info\.{0,3}OK/i.test(chunk) ||
    (/Waiting for user info/i.test(chunk) && /\bOK\b/.test(chunk))
  ) {
    add("login-ok", "Steam login OK");
  }

  const createMatch = chunk.match(/Create new workshop item\s*\(\s*PublishFileID\s+(\d+)\s*\)/i);
  if (createMatch) {
    add("create", `Creating Workshop item ${createMatch[1]}…`);
  }

  if (/Preparing update/i.test(chunk)) add("prepare-update", "Preparing update…");
  if (/Preparing content/i.test(chunk)) add("prepare-content", "Preparing content…");
  if (/Uploading content/i.test(chunk)) add("upload-content", "Uploading content…");
  if (/Uploading preview/i.test(chunk)) add("upload-preview", "Uploading preview…");
  if (/Committing update/i.test(chunk)) add("commit", "Committing update…");

  // SteamCMD often prints "Success." on its own line after workshop chatter.
  const uploadSuccess =
    (workshopUploadFinished(chunk) ||
      (/Success\./i.test(chunk) &&
        (seen.has("create") ||
          seen.has("prepare-update") ||
          seen.has("upload-content") ||
          seen.has("commit")))) &&
    !/ERROR!/i.test(chunk);
  if (uploadSuccess) {
    add("success", "Workshop upload OK");
  }

  const errorMatch = chunk.match(/ERROR!\s*(.+)/i);
  if (errorMatch) {
    add("error", `SteamCMD error: ${errorMatch[1].trim()}`);
  } else if (steamCmdNeedsCachedLogin(chunk)) {
    add("no-creds", "SteamCMD has no cached credentials");
  }

  return lines;
}

/**
 * @param {string} bin
 * @param {string[]} args
 * @param {{
 *   logPath?: string | null;
 *   onStatus?: (line: string) => void;
 *   quiet?: boolean;
 *   requestQuitOn?: (out: string) => boolean;
 * }} [options]
 * @returns {Promise<{ code: number | null; out: string }>}
 */
export function runSteamCmd(bin, args, options = {}) {
  const {
    logPath = null,
    onStatus = null,
    quiet = true,
    requestQuitOn = (out) =>
      workshopUploadFinished(out) || /ERROR!/i.test(out) || /Steam>/.test(out),
  } = options;

  return new Promise((resolve, reject) => {
    // Do not inherit the TTY. SteamCMD otherwise stays on the Steam> prompt
    // after +workshop_build_item and never runs +quit.
    const child = spawn(bin, args, {
      cwd: dirname(bin),
      env: steamCmdEnv(),
      stdio: ["pipe", "pipe", "pipe"],
    });
    try {
      child.stdin.end();
    } catch {
      /* ignore */
    }

    let out = "";
    let settled = false;
    /** @type {ReturnType<typeof setTimeout> | null} */
    let stopTimer = null;
    const seenStatus = new Set();
    /** @type {string[]} */
    const logChunks = [];

    const finish = (code) => {
      if (settled) return;
      settled = true;
      if (stopTimer) clearTimeout(stopTimer);
      try {
        child.stdin.end();
      } catch {
        /* already closed */
      }
      if (logPath) {
        mkdirSync(dirname(logPath), { recursive: true });
        writeFileSync(logPath, logChunks.join(""), "utf8");
      }
      resolve({ code, out });
    };

    const stopSteamCmd = (reason) => {
      if (settled || child.exitCode != null) return;
      if (!quiet) console.warn(`${reason} Stopping SteamCMD.`);
      try {
        child.kill("SIGTERM");
      } catch {
        /* already gone */
      }
      setTimeout(() => {
        if (settled || child.exitCode != null) return;
        try {
          child.kill("SIGKILL");
        } catch {
          /* already gone */
        }
      }, 2000);
    };

    const requestQuit = () => {
      if (settled || stopTimer) return;
      try {
        child.stdin.write("quit\n");
        child.stdin.end();
      } catch {
        /* stdin closed */
      }
      stopTimer = setTimeout(() => {
        stopSteamCmd("SteamCMD did not exit after the upload.");
      }, 8000);
    };

    const handleChunk = (chunk) => {
      const text = String(chunk);
      out += text;
      logChunks.push(text);
      if (!quiet) process.stdout.write(chunk);
      if (onStatus) {
        for (const line of steamCmdStatusLines(text, seenStatus)) {
          onStatus(line);
        }
      }
      if (requestQuitOn(out)) requestQuit();
    };

    child.stdin.on("error", () => {
      /* EPIPE when SteamCMD already left */
    });
    child.stdout.on("data", handleChunk);
    child.stderr.on("data", handleChunk);
    child.on("error", reject);
    child.on("close", (code) => finish(code));
  });
}

/**
 * Non-interactive login probe (uses cached credentials only).
 * @param {string} bin
 * @param {string} account
 * @param {{ logPath?: string | null; onStatus?: (line: string) => void }} [options]
 */
export async function probeSteamCmdLogin(bin, account, options = {}) {
  const result = await runSteamCmd(
    bin,
    ["+@ShutdownOnFailedCommand", "1", "+@NoPromptForPassword", "1", "+login", account, "+quit"],
    {
      ...options,
      quiet: true,
      requestQuitOn: (out) =>
        steamCmdNeedsCachedLogin(out) ||
        steamCmdLoginSucceeded(out) ||
        /ERROR!/i.test(out) ||
        /Steam>/.test(out) ||
        /Unloading Steam API/i.test(out),
    },
  );
  const ok =
    !steamCmdNeedsCachedLogin(result.out) &&
    (steamCmdLoginSucceeded(result.out) || result.code === 0);
  return { ...result, ok };
}

/**
 * Interactive login so SteamCMD can cache credentials.
 * @param {string} bin
 * @param {string} account
 * @returns {Promise<number | null>}
 */
export function runSteamCmdInteractiveLogin(bin, account) {
  return new Promise((resolve, reject) => {
    console.log("");
    console.log(`SteamCMD has no cached login for ${account}.`);
    console.log("Enter your Steam password (and Steam Guard code if asked).");
    console.log("Credentials stay under ~/.cache/sandustry-steamcmd/ (not the Steam client).");
    console.log("");
    const child = spawn(bin, ["+login", account, "+quit"], {
      cwd: dirname(bin),
      env: steamCmdEnv(),
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("close", (code) => resolve(code));
  });
}

/**
 * @param {string} steamCmd
 * @param {string} account
 * @param {string} vdfFile
 * @param {{ logPath?: string | null; onStatus?: (line: string) => void }} [options]
 */
export function runWorkshopUpload(steamCmd, account, vdfFile, options = {}) {
  return runSteamCmd(
    steamCmd,
    [
      "+@ShutdownOnFailedCommand",
      "1",
      "+@NoPromptForPassword",
      "1",
      "+login",
      account,
      "+workshop_build_item",
      vdfFile,
      "+quit",
    ],
    {
      ...options,
      quiet: true,
    },
  );
}
