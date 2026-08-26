/**
 * File-log HTTP server for `npm run dev` (--watch only).
 * POST /log (append) and POST /log/clear (truncate) for renderer `console.*`.
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import http from "node:http";
import { join } from "node:path";
import { styleText } from "../lib/cli-style.js";
import { sandustryLogsDir } from "../lib/paths.js";

export const DEV_WATCH_PORT = 19147;

/** @returns {string} */
export function logServerUrl() {
  return `http://127.0.0.1:${DEV_WATCH_PORT}`;
}

/** @type {import('node:http').Server | null} */
let server = null;

/**
 * @param {string} modId
 * @returns {string}
 */
function safeLogId(modId) {
  return String(modId).replace(/[^a-zA-Z0-9._-]+/g, "_") || "mod";
}

/**
 * @param {string} modId
 * @returns {string}
 */
function logFilePath(modId) {
  const dir = sandustryLogsDir();
  mkdirSync(dir, { recursive: true });
  return join(dir, `${safeLogId(modId)}.log`);
}

/**
 * Truncate `logs/<modId>.log` so the next append starts a fresh session.
 * @param {string} modId
 */
export function clearModLog(modId) {
  writeFileSync(logFilePath(modId), "");
}

const CORS = { "Access-Control-Allow-Origin": "*" };

/**
 * @param {import("node:http").IncomingMessage} req
 * @returns {Promise<string>}
 */
function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

/** Start the log HTTP server once. No-op if already listening. */
export function startLogServer() {
  if (server) return;

  server = http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        ...CORS,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    if (req.method === "POST" && (req.url === "/log/clear" || req.url?.startsWith("/log/clear?"))) {
      void readBody(req).then((raw) => {
        let modId = "mod";
        try {
          const parsed = JSON.parse(raw);
          if (
            parsed &&
            typeof parsed === "object" &&
            typeof parsed.modId === "string" &&
            parsed.modId.trim()
          ) {
            modId = parsed.modId.trim();
          }
        } catch {
          /* plain text or empty body — default mod id */
        }
        clearModLog(modId);
        res.writeHead(204, CORS);
        res.end();
      });
      return;
    }

    if (req.method === "POST" && (req.url === "/log" || req.url?.startsWith("/log?"))) {
      void readBody(req).then((raw) => {
        let modId = "mod";
        let line = raw;
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            if (typeof parsed.modId === "string" && parsed.modId.trim())
              modId = parsed.modId.trim();
            if (typeof parsed.line === "string") line = parsed.line;
          }
        } catch {
          /* plain text body */
        }
        appendFileSync(logFilePath(modId), line.endsWith("\n") ? line : `${line}\n`);
        res.writeHead(204, CORS);
        res.end();
      });
      return;
    }

    res.writeHead(404, CORS);
    res.end("not found");
  });

  server.listen(DEV_WATCH_PORT, "127.0.0.1", () => {
    console.log(
      `${styleText("cyan", "log server")}${styleText("dim", ":")} ${styleText(["underline", "cyan"], logServerUrl())} ${styleText("dim", "(POST /log)")}`,
    );
  });

  server.on("error", (error) => {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
    if (code === "EADDRINUSE") {
      server = null;
      console.log(
        styleText(
          "dim",
          `log server already running on ${logServerUrl()} (this watch will not bind)`,
        ),
      );
      return;
    }
    console.error(styleText("red", `log server failed: ${error.message}`));
  });
}
